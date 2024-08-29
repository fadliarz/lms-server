import "reflect-metadata";
import { PrivilegeModel, UserModel } from "../user.type";
import { injectable } from "inversify";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { IUserRepository } from "../user.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import {
  CourseEnrollmentRoleModel,
  CourseModel,
} from "../../course/course.type";
import { $UserAPI } from "../user.api";

@injectable()
export default class UserRepository
  extends BaseRepository
  implements IUserRepository
{
  constructor() {
    super();
  }

  public async createUser(
    data: {
      accessToken: string;
      refreshToken: string[];
    } & $UserAPI.CreateUser.Dto,
  ): Promise<UserModel> {
    return this.db.user.create({
      data,
    });
  }

  public async createUserAndBlankReport(
    data: {
      accessToken: string;
      refreshToken: string[];
    } & $UserAPI.CreateUser.Dto,
  ): Promise<UserModel> {
    console.log(data);

    return this.db.user.create({
      data: {
        ...data,
        report: {
          create: {},
        },
      },
    });
  }

  public async getPublicUsers(
    query: $UserAPI.GetPublicUsers.Query,
  ): Promise<$UserAPI.GetPublicUsers.Response["data"]> {
    const select = { id: true, NIM: true, name: true, avatar: true };

    if (query && query.pageSize && !query.pageNumber) {
      return this.db.user.findMany({ take: query.pageSize, select });
    }

    if (query && query.pageSize && query.pageNumber) {
      return this.db.user.findMany({
        take: query.pageSize,
        skip: (query.pageNumber - 1) * query.pageSize,
        select,
      });
    }

    return this.db.user.findMany({ select });
  }

  public async getUserById(id: { userId: number }): Promise<UserModel | null> {
    return this.db.user.findUnique({
      where: {
        id: id.userId,
      },
    });
  }

  public async getUserByIdOrThrow(
    id: { userId: number },
    error?: Error,
  ): Promise<UserModel> {
    const user = await this.getUserById(id);

    if (!user) {
      throw error || new RecordNotFoundException();
    }

    return user;
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  public async getUserByAccessToken(
    accessToken: string,
  ): Promise<UserModel | null> {
    return this.db.user.findFirst({
      where: {
        accessToken,
      },
    });
  }

  public async getUserByRefreshToken(
    refreshToken: string,
  ): Promise<UserModel | null> {
    return this.db.user.findFirst({
      where: {
        refreshToken: {
          has: refreshToken,
        },
      },
    });
  }

  public async getUserPermissions(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserPermissions.Response["data"]> {
    const permissions: $UserAPI.GetUserPermissions.Response["data"] = {
      programEnrollment: {
        manage: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.PROGRAM,
        ),
      },
      event: {
        manage: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.PROGRAM,
        ),
      },
      category: {
        manage: false,
      },
      course: {
        manage_the_course: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.COURSE,
        ),
        manage_course_content: false,
      },
      competition: {
        manage: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.COMPETITION,
        ),
      },
      scholarship: {
        manage: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.SCHOLARSHIP,
        ),
      },
      report: {
        manage: await this.getUserAuthorizationStatusFromPrivilege(
          id,
          PrivilegeModel.REPORT,
        ),
      },
    };

    permissions.category.manage = permissions.course.manage_the_course;
    permissions.course.manage_course_content = !(
      (await this.getUserOneCourseEnrollmentId(id, {
        role: CourseEnrollmentRoleModel.INSTRUCTOR,
      })) === null
    );

    return permissions;
  }

  public async getUserAssignments(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserAssignments.Response["data"]> {
    const classAssignments = await this.db.courseClassAssignment.findMany({
      where: {
        courseClass: {
          course: {
            enrollments: {
              some: {
                userId: id.userId,
              },
            },
          },
        },
      },
      include: {
        courseClass: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        assignmentCompletions: {
          where: {
            userId: id.userId,
          },
        },
      },
    });

    const assignments: $UserAPI.GetUserAssignments.Response["data"] = [];
    for (let theAssignment of classAssignments) {
      const {
        courseClass: theCourseClass,
        assignmentCompletions: theCompletions,
        ...assignment
      } = theAssignment;
      const { course: theCourse, ...theClass } = theCourseClass;
      assignments.push({
        type: "course",
        assignment: {
          ...assignment,
          class: theClass,
          course: theCourse,
          completion: theCompletions.length > 0 ? theCompletions[0] : null,
        },
      });
    }

    const personalAssignments = await this.db.personalAssignment.findMany({
      where: id,
    });
    for (let theAssignment of personalAssignments) {
      assignments.push({
        type: "personal",
        assignment: theAssignment,
      });
    }

    assignments.sort(
      (a, b) =>
        b.assignment.deadline.getTime() - a.assignment.deadline.getTime(),
    );

    return assignments;
  }

  public async getUserEventAndCourseSchedules(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserEventAndCourseSchedules.Response["data"]> {
    const events = await this.db.event.findMany();
    const schedules = await this.db.courseSchedule.findMany({
      where: {
        course: {
          OR: [
            {
              enrollments: {
                some: {
                  userId: id.userId,
                },
              },
            },
          ],
        },
      },
    });

    const allUpcoming = [...events, ...schedules];

    allUpcoming.sort((a, b) => b.date.getTime() - a.date.getTime());

    return allUpcoming;
  }

  public async getUserEnrolledCourses(
    id: {
      userId: number;
    },
    where: {
      role: CourseEnrollmentRoleModel;
    },
  ): Promise<CourseModel[]> {
    const enrollments = await this.db.courseEnrollment.findMany({
      where: { userId: id.userId, role: where.role },
      select: {
        course: true,
      },
    });

    const courses: CourseModel[] = [];
    for (const enrollment of enrollments) {
      courses.push(enrollment.course);
    }

    return courses;
  }

  public async getUserOneCourseEnrollmentId(
    id: {
      userId: number;
    },
    where: {
      role: CourseEnrollmentRoleModel;
    },
  ): Promise<{ id: number } | null> {
    return this.db.courseEnrollment.findFirst({
      where: { userId: id.userId, role: where.role },
      select: { id: true },
    });
  }

  public async getUserEnrolledDepartmentPrograms(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserEnrolledDepartmentPrograms.Response["data"]> {
    const enrollments = await this.db.departmentProgramEnrollment.findMany({
      where: {
        userId: id.userId,
      },
      select: {
        program: true,
      },
    });

    const programs: $UserAPI.GetUserEnrolledDepartmentPrograms.Response["data"] =
      [];
    for (const enrollment of enrollments) {
      programs.push(enrollment.program);
    }

    programs.sort((a, b) => b.date.getTime() - a.date.getTime());

    return programs;
  }

  public async getUserLedDepartments(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserManagedDepartments.Response["data"]> {
    return this.db.department.findMany({
      where: {
        OR: [{ leaderId: id.userId }, { coLeaderId: id.userId }],
      },
    });
  }

  public async getUserLedDepartmentDivisions(id: {
    userId: number;
  }): Promise<$UserAPI.GetUserManagedDepartmentDivisions.Response["data"]> {
    return this.db.departmentDivision.findMany({
      where: {
        OR: [{ leaderId: id.userId }, { coLeaderId: id.userId }],
      },
      include: {
        department: { select: { id: true, title: true } },
      },
    });
  }

  public async getUserReportOrThrow(
    id: {
      userId: number;
    },
    error?: Error,
  ): Promise<$UserAPI.GetUserReport.Response["data"]> {
    const report = await this.db.report.findUnique({
      where: id,
    });

    if (!report) {
      throw error || new RecordNotFoundException();
    }

    return report;
  }

  public async getUserAuthorizationStatusFromPrivilege(
    id: {
      userId: number;
    },
    privilege: PrivilegeModel,
  ): Promise<boolean> {
    const department = await this.db.department.findFirst({
      where: {
        OR: [
          { leaderId: id.userId },
          { coLeaderId: id.userId },
          {
            divisions: {
              some: {
                enrollments: {
                  some: { userId: id.userId },
                },
                privileges: {
                  privilege,
                },
              },
            },
          },
        ],
      },
    });

    return department !== null;
  }

  public async updateUser(
    id: { userId: number },
    data: Partial<UserModel>,
  ): Promise<UserModel> {
    return this.db.user.update({
      where: { id: id.userId },
      data,
    });
  }

  public async deleteUser(id: { userId: number }): Promise<UserModel> {
    return this.db.user.delete({
      where: { id: id.userId },
    });
  }
}
