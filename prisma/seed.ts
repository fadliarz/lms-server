import {
  Course,
  CourseEnrollment,
  CourseLesson,
  Prisma,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import sha256Encrypt from "../src/utils/encrypt";

const prisma = new PrismaClient();

const courseLikeTable = prisma.courseLike;
const courseEnrollmentTable = prisma.courseEnrollment;
const courseLessonTable = prisma.courseLesson;
const courseLessonVideoTable = prisma.courseLessonVideo;
const courseTable = prisma.course;
const userTable = prisma.user;

async function cleanTables() {
  await courseLikeTable.deleteMany();
  await courseEnrollmentTable.deleteMany();
  await courseLessonVideoTable.deleteMany();
  await courseLessonTable.deleteMany();
  await courseLessonVideoTable.deleteMany();
  await courseTable.deleteMany();
  await userTable.deleteMany();
}

function generateSample<T>(array: Array<T>): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function insertVideos(videoPerCourse: number) {
  try {
    let count = 0;
    const { id: maxLessonId } = await courseLessonTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });

    let myCursor = -1;
    let lesson: Pick<CourseLesson, "id">;

    while (myCursor < maxLessonId) {
      const lessons = await courseLessonTable.findMany({
        take: 1,
        skip: myCursor === -1 ? 0 : 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
        },
      });

      lesson = lessons[0];
      myCursor = lesson.id;

      const data: Prisma.CourseLessonVideoCreateManyInput[] = [];

      for (let index = 0; index < videoPerCourse; index++) {
        data.push({
          lessonId: lesson.id,
          name: faker.lorem.word(),
          description: faker.lorem.words(5),
          totalDurations: faker.number.float({ min: 2, max: 100 }),
          youtubeLink: generateSample([
            "https://www.youtube.com/watch?v=URwmzTeuHdk&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
            "https://www.youtube.com/watch?v=GsF8R6DBxSg&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
            "https://www.youtube.com/watch?v=BTD5I1BMx2Q&pp=ygUOaHVzc2VpbiBuYXNzZXI%3D",
          ]),
        });
      }

      const videos = await courseLessonVideoTable.createMany({
        data,
      });

      count += videos.count;
    }

    console.log(
      "Completed inserting " + count + " course videos to the database!"
    );
  } catch (error: any) {
    console.log(
      "Failed inserting course videos: " + error.message || "Unknown error"
    );

    throw error;
  }
}

async function insertLessons(lessonPerCourse: number) {
  try {
    let count = 0;
    const { id: maxCourseId } = await courseTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: {
        id: true,
      },
    });

    let myCursor = -1;
    let course: Pick<Course, "id">;

    while (myCursor < maxCourseId) {
      const courses = await courseTable.findMany({
        take: 1,
        skip: myCursor === -1 ? 0 : 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
        },
      });

      course = courses[0];
      myCursor = course.id;

      const data: Prisma.CourseLessonCreateManyInput[] = [];

      for (let index = 0; index < lessonPerCourse; index++) {
        data.push({
          courseId: course.id,
          title: faker.lorem.word(),
          description: faker.lorem.words(5),
        });
      }

      const lessons = await courseLessonTable.createMany({
        data,
      });

      count += lessons.count;
    }

    console.log(
      "Completed inserting " + count + " course lessons to the database!"
    );
  } catch (error: any) {
    console.log(
      "Failed inserting course lessons: " + error.message || "Unknown error"
    );

    throw error;
  }
}

async function updateCourseCount() {
  try {
    let myCursor = -1;
    let course: Pick<Course, "id">;

    const { id: maxId } = await courseTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    while (myCursor < maxId) {
      const courses = await courseTable.findMany({
        skip: myCursor === -1 ? undefined : 1,
        take: 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
        },
      });

      course = courses[0];
      myCursor = course.id;

      const totalStudents = await courseEnrollmentTable.count({
        where: {
          courseId: course.id,
          role: Role.STUDENT,
        },
      });
      const totalInstructors = await courseEnrollmentTable.count({
        where: {
          courseId: course.id,
          role: Role.INSTRUCTOR,
        },
      });
      const totalLessons = await courseLessonTable.count({
        where: {
          courseId: course.id,
        },
      });
      const totalLikes = await courseLikeTable.count({
        where: {
          courseId: course.id,
        },
      });

      await courseTable.update({
        where: {
          id: course.id,
        },
        data: {
          totalStudents,
          totalInstructors,
          totalLessons,
          totalLikes,
        },
      });
    }

    console.log("Completed updating course count!");
  } catch (error: any) {
    console.log(
      "Error updating course count: " + error.message || "unknown error"
    );

    throw error;
  }
}

async function insertCourseEnrollments(
  enrollmentPerCase: number
): Promise<{ count: number }> {
  try {
    let count = 0;
    let myCursor = -1;
    let course: Pick<Course, "id" | "authorId">;

    const { id: maxCourseId } = await prisma.course.findFirstOrThrow({
      select: { id: true },
      orderBy: {
        id: "desc",
      },
    });

    while (myCursor < maxCourseId) {
      const courses = await prisma.course.findMany({
        skip: myCursor === -1 ? 0 : 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
          authorId: true,
        },
      });

      course = courses[0];
      myCursor = course.id;

      const [studentsAsStudent, instructorsAsStudent, adminsAsStudent] =
        await Promise.all([
          prisma.user.findMany({
            where: {
              role: Role.STUDENT,
            },
            take: enrollmentPerCase,
            select: {
              id: true,
            },
          }),
          prisma.user.findMany({
            where: {
              role: Role.INSTRUCTOR,
              id: {
                notIn: [course.authorId],
              },
            },
            take: enrollmentPerCase,
            select: {
              id: true,
            },
          }),
          prisma.user.findMany({
            where: {
              role: Role.OWNER,
              id: {
                notIn: [course.authorId],
              },
            },
            take: enrollmentPerCase,
            select: {
              id: true,
            },
          }),
        ]);

      const [instructorsAsInstructor, adminsAsInstructor] = await Promise.all([
        prisma.user.findMany({
          where: {
            role: Role.INSTRUCTOR,
            id: {
              notIn: [
                ...instructorsAsStudent.map((instructor) => instructor.id),
                course.authorId,
              ],
            },
          },
          take: enrollmentPerCase,
          select: {
            id: true,
          },
        }),
        prisma.user.findMany({
          where: {
            role: Role.OWNER,
            id: {
              notIn: [
                ...adminsAsStudent.map((admin) => admin.id),
                course.authorId,
              ],
            },
          },
          take: enrollmentPerCase,
          select: {
            id: true,
          },
        }),
      ]);

      await Promise.all([
        prisma.courseEnrollment.createMany({
          data: studentsAsStudent.map((user) => {
            return {
              courseId: course.id,
              userId: user.id,
              role: Role.STUDENT,
            };
          }),
        }),
        prisma.courseEnrollment.createMany({
          data: instructorsAsStudent.map((user) => {
            return {
              courseId: course.id,
              userId: user.id,
              role: Role.STUDENT,
            };
          }),
        }),
        prisma.courseEnrollment.createMany({
          data: adminsAsStudent.map((user) => {
            return {
              courseId: course.id,
              userId: user.id,
              role: Role.STUDENT,
            };
          }),
        }),
        prisma.courseEnrollment.createMany({
          data: instructorsAsInstructor.map((user) => {
            return {
              courseId: course.id,
              userId: user.id,
              role: Role.INSTRUCTOR,
            };
          }),
        }),
        prisma.courseEnrollment.createMany({
          data: adminsAsInstructor.map((user) => {
            return {
              courseId: course.id,
              userId: user.id,
              role: Role.INSTRUCTOR,
            };
          }),
        }),
      ]).then((datas) => {
        datas.forEach((data) => {
          count += data.count;
        });
      });
    }

    console.log(
      "Completed inserting " + count + " course enrollments to the database!"
    );

    return { count };
  } catch (error: any) {
    console.log(
      "Failed inserting course enrollments: " + error.message || "Unknown error"
    );

    throw error;
  }
}

function generateCourseCreateInputArray(
  total: number,
  authorId: number
): Prisma.CourseCreateManyInput[] {
  try {
    const courses: Prisma.CourseCreateManyInput[] = [];

    for (let index = 0; index < total; index++) {
      const courseObject: Prisma.CourseCreateManyInput = {
        title: faker.lorem.word(),
        authorId,
        image: faker.image.url(),
      };

      courses.push(courseObject);
    }

    return courses;
  } catch (error) {
    console.log("Failed creating course create input array!");

    throw error;
  }
}

async function insertCourses(
  coursePerInstructorOrAdmin: number
): Promise<{ count: number }> {
  try {
    let count = 0;
    let instructor: Pick<User, "id">;
    let admin: Pick<User, "id">;
    let instructorCursor = -1;
    let adminCursor = -1;

    const { id: maxInstructorId } = await userTable.findFirstOrThrow({
      where: {
        role: Role.INSTRUCTOR,
      },
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });
    const { id: maxAdminId } = await userTable.findFirstOrThrow({
      where: {
        role: Role.OWNER,
      },
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    while (instructorCursor < maxInstructorId) {
      const instructors = await userTable.findMany({
        skip: instructorCursor === -1 ? 0 : 1,
        take: 1,
        cursor:
          instructorCursor === -1
            ? undefined
            : {
                id: instructorCursor,
              },
        where: {
          role: Role.INSTRUCTOR,
        },
        select: {
          id: true,
        },
      });

      instructor = instructors[0];
      instructorCursor = instructor.id;

      const courses = await courseTable.createMany({
        data: generateCourseCreateInputArray(
          coursePerInstructorOrAdmin,
          instructor.id
        ),
      });

      count += courses.count;
    }

    while (adminCursor < maxAdminId) {
      const admins = await userTable.findMany({
        skip: adminCursor === -1 ? 0 : 1,
        take: 1,
        cursor:
          adminCursor === -1
            ? undefined
            : {
                id: adminCursor,
              },
        where: {
          role: Role.OWNER,
        },
        select: {
          id: true,
        },
      });

      admin = admins[0];
      adminCursor = admin.id;

      const courses = await courseTable.createMany({
        data: generateCourseCreateInputArray(
          coursePerInstructorOrAdmin,
          admin.id
        ),
      });

      count += courses.count;
    }

    console.log("Completed inserting " + count + " courses to the database!");

    return {
      count,
    };
  } catch (error: any) {
    console.log(
      "Failed inserting courses: " + error.message || "Unknown error"
    );

    throw error;
  }
}

function generateUserCreateInputArray(
  total: number,
  role: Role
): Prisma.UserCreateInput[] {
  try {
    const users: Prisma.UserCreateInput[] = [];

    for (let index = 0; index < total; index++) {
      const userObject: Prisma.UserCreateInput = {
        email: faker.internet.email(),
        password: sha256Encrypt("password"),
        name: faker.internet.displayName(),
        NIM: faker.internet.port().toString(),
        role,
      };

      users.push(userObject);
    }

    return users;
  } catch (error) {
    console.log("Failed creating user create input array!");

    throw error;
  }
}

async function insertUsers(
  total: number,
  role: Role
): Promise<{ count: number }> {
  try {
    let count = 0;

    if (total > 100) {
      for (let i = 0; i < Math.floor(total / 100); i++) {
        const returnObj = await userTable.createMany({
          data: generateUserCreateInputArray(total, role),
          skipDuplicates: true,
        });

        count += returnObj.count;
      }
    }

    const returnObj = await userTable.createMany({
      data: generateUserCreateInputArray(
        total > 100 ? total % 100 : total,
        role
      ),
      skipDuplicates: true,
    });

    count += returnObj.count;

    console.log("Completed inserting " + count + " users to the database!");

    return {
      count,
    };
  } catch (error) {
    console.log("Failed inserting ".concat(role, "s!"));

    throw error;
  }
}

async function updateUserCount() {
  try {
    let count = 0;
    let myCursor = -1;
    let user: Pick<User, "id">;

    const { id: maxId } = await userTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    while (myCursor < maxId) {
      let totalLessons = 0;
      let totalCourses = 0;

      const users = await userTable.findMany({
        skip: myCursor === -1 ? undefined : 1,
        take: 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
        },
      });

      user = users[0];
      myCursor = user.id;

      const courseEnrollments = await courseEnrollmentTable.findMany({
        where: {
          userId: user.id,
        },
        select: {
          courseId: true,
        },
      });

      for (let i = 0; i < courseEnrollments.length; i++) {
        const course = await courseTable.findUniqueOrThrow({
          where: {
            id: courseEnrollments[i].courseId,
          },
          select: {
            totalLessons: true,
          },
        });

        totalLessons += course.totalLessons;
        totalCourses++;
      }

      await userTable.update({
        where: {
          id: user.id,
        },
        data: {
          totalCourses,
          totalLessons,
        },
      });

      count++;
    }

    console.log("Completed updating user count!");
  } catch (error: any) {
    console.log(
      "Error updating user count: " + error.message || "unknown error"
    );

    throw error;
  }
}

async function deleteAuthorEnrollment() {
  try {
    let myCursor = -1;
    let course: Pick<Course, "id" | "authorId">;
    let count = 0;

    const { id: maxId } = await courseTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    while (myCursor < maxId) {
      const courses = await courseTable.findMany({
        skip: myCursor === -1 ? 0 : 1,
        take: 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        select: {
          id: true,
          authorId: true,
        },
      });

      course = courses[0];
      myCursor = course.id;

      try {
        const enrollment = await courseEnrollmentTable.findUnique({
          where: {
            userId_courseId: {
              userId: course.authorId,
              courseId: course.id,
            },
          },
        });

        if (enrollment) {
          await courseEnrollmentTable.delete({
            where: {
              userId_courseId: {
                userId: course.authorId,
                courseId: course.id,
              },
            },
          });
        }

        count++;
      } catch (error) {
        console.log(count);
        throw error;
      }
    }

    console.log("Completed deleting author enrollment!");
  } catch (error: any) {
    console.log(
      "Error deleting author enrollment: " + error.message || "unknown error"
    );

    throw error;
  }
}

async function insertCourseLikes() {
  try {
    let myCursor = -1;
    let count = 0;
    let enrollment: CourseEnrollment;

    const { id: maxEnrollmentId } =
      await prisma.courseEnrollment.findFirstOrThrow({
        where: {
          role: Role.STUDENT,
        },
        orderBy: {
          id: "desc",
        },
        select: {
          id: true,
        },
      });

    while (myCursor < maxEnrollmentId) {
      const enrollments = await prisma.courseEnrollment.findMany({
        skip: myCursor === -1 ? 0 : 1,
        cursor:
          myCursor === -1
            ? undefined
            : {
                id: myCursor,
              },
        where: {
          role: Role.STUDENT,
        },
      });

      enrollment = enrollments[0];
      myCursor = enrollment.id;

      await prisma.courseLike.create({
        data: {
          userId: enrollment.userId,
          courseId: enrollment.courseId,
        },
      });

      count++;
    }

    console.log("Completed inserting cousre like! count: ", count);
  } catch (error: any) {
    console.log(
      "Error inserting course like: " + error.message || "unknown error"
    );

    throw error;
  }
}

async function seed() {
  await cleanTables();

  const TOTAL_STUDENT = 3;
  const TOTAL_INSTRUCTORS = 5;
  const TOTAL_ADMIN = 5;

  await insertUsers(TOTAL_STUDENT, Role.STUDENT);
  await insertUsers(TOTAL_INSTRUCTORS, Role.INSTRUCTOR);
  await insertUsers(TOTAL_ADMIN, Role.OWNER);
  await insertCourses(1);
  await insertCourseEnrollments(2);
  await insertLessons(2);
  await insertVideos(2);
  await updateUserCount();
  await deleteAuthorEnrollment();
  await insertCourseLikes();
  await updateCourseCount();
}

export default seed;
