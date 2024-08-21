import { ICourseClassAssignmentRepository } from "../../../modules/assignment/assignment.interface";
import { ICourseCategoryRepository } from "../../../modules/category/category.interface";
import { ICourseRepository } from "../../../modules/course/course.interface";
import { ICourseClassRepository } from "../../../modules/class/class.interface";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/enrollment.interface";
import { ICourseLessonRepository } from "../../../modules/lesson/lesson.interface";
import { IUserRepository } from "../../../modules/user/user.interface";
import { ICourseLessonVideoRepository } from "../../../modules/video/video.interface";
import { IDepartmentRepository } from "../../../modules/department/department.interface";
import { IDepartmentDivisionRepository } from "../../../modules/division/division.interface";
import { IPersonalAssignmentRepository } from "../../../modules/personal-assignment/assignment.interface";
import { IReportRepository } from "../../../modules/report/report.interface";
import { ICourseClassAssignmentCompletionRepository } from "../../../modules/assignment-completion/completion.interface";
import { IDepartmentProgramRepository } from "../../../modules/program/program.interface";

export const RepositoryDITypes = {
  FACADE: Symbol.for("FACADE_REPOSITORY"),
};

export class IRepository {
  user: IUserRepository;
  report: IReportRepository;
  personalAssignment: IPersonalAssignmentRepository;
  courseCategory: ICourseCategoryRepository;
  courseEnrollment: ICourseEnrollmentRepository;
  course: ICourseRepository;
  courseLesson: ICourseLessonRepository;
  courseLessonVideo: ICourseLessonVideoRepository;
  courseClass: ICourseClassRepository;
  courseClassAssignment: ICourseClassAssignmentRepository;
  courseClassAssignmentCompletion: ICourseClassAssignmentCompletionRepository;
  department: IDepartmentRepository;
  departmentProgram: IDepartmentProgramRepository;
  departmentDivision: IDepartmentDivisionRepository;
}
