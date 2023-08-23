import {
  Course,
  CourseLesson,
  Prisma,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import isEqualOrIncludeRole from "../src/common/functions/isEqualOrIncludeRole";
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

let INSTRUCTOR_CURSOR = -1;
const TOTAL_COURSES = 20;
const MAXIMUM_COURSE_INSERTION = 100;

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

      await courseTable.update({
        where: {
          id: course.id,
        },
        data: {
          totalStudents,
          totalInstructors,
          totalLessons,
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
  total: number,
  enrollmentPerUser: number
): Promise<{ count: number }> {
  try {
    if (enrollmentPerUser > TOTAL_COURSES) {
      throw new Error("enrollmentPerUser > TOTAL_COURSES");
    }

    let count = 0;
    let user: Pick<User, "id" | "role">;

    const { id: maxUserId } = await userTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    const { id: maxCourseId } = await courseTable.findFirstOrThrow({
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    let userCursor = -1;
    let courseCursor = -1;

    for (
      let index = 0;
      index < Math.floor(total / enrollmentPerUser);
      index++
    ) {
      if (userCursor === maxUserId) {
        userCursor = -1;
      }
      if (courseCursor === maxCourseId) {
        courseCursor = -1;
      }

      const users = await userTable.findMany({
        skip: userCursor === -1 ? undefined : 1,
        take: 1,
        cursor:
          userCursor === -1
            ? undefined
            : {
                id: userCursor,
              },
        select: {
          id: true,
          role: true,
        },
      });
      const courses = await courseTable.findMany({
        skip: courseCursor === -1 ? undefined : 1,
        take: 3,
        cursor:
          courseCursor === -1
            ? undefined
            : {
                id: courseCursor,
              },
        select: {
          id: true,
        },
      });

      user = users[0];
      userCursor = user.id;
      courseCursor = courses[courses.length - 1].id;

      const enrollments = await courseEnrollmentTable.createMany({
        data: courses.map((course) => {
          return {
            courseId: course.id,
            userId: user.id,
            role: isEqualOrIncludeRole(user.role, Role.INSTRUCTOR)
              ? generateSample([Role.STUDENT, Role.INSTRUCTOR])
              : Role.STUDENT,
          };
        }),
      });

      count += enrollments.count;
    }

    console.log(
      "Completed inserting " + count + " course enrollments to the database!"
    );

    return {
      count,
    };
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
  total: number,
  coursePerInstructor: number
): Promise<{ count: number }> {
  try {
    if (total > MAXIMUM_COURSE_INSERTION) {
      throw new Error("Maximum course insertion!");
    }

    if (total < coursePerInstructor) {
      throw new Error("total < coursePerInstructor");
    }

    let count = 0;
    let instructor: Pick<User, "id">;

    const { id } = await userTable.findFirstOrThrow({
      where: {
        role: Role.INSTRUCTOR,
      },
      orderBy: {
        id: "desc",
      },
      select: { id: true },
    });

    for (
      let index = 0;
      index < Math.floor(total / coursePerInstructor);
      index++
    ) {
      if (INSTRUCTOR_CURSOR === id) {
        INSTRUCTOR_CURSOR = -1;
      }

      const instructors = await userTable.findMany({
        skip: INSTRUCTOR_CURSOR === -1 ? undefined : 1,
        take: 1,
        cursor:
          INSTRUCTOR_CURSOR === -1
            ? undefined
            : {
                id: INSTRUCTOR_CURSOR,
              },
        where: {
          role: Role.INSTRUCTOR,
        },
        select: {
          id: true,
        },
      });

      instructor = instructors[0];
      INSTRUCTOR_CURSOR = instructor.id;

      const courses = await courseTable.createMany({
        data: generateCourseCreateInputArray(
          coursePerInstructor,
          instructor.id
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

async function main() {
  await cleanTables();

  const TOTAL_STUDENT = 5;
  const TOTAL_INSTRUCTORS = 15;

  await insertUsers(TOTAL_STUDENT, Role.STUDENT);
  await insertUsers(TOTAL_INSTRUCTORS, Role.INSTRUCTOR);
  await insertCourses(TOTAL_COURSES, TOTAL_INSTRUCTORS / TOTAL_COURSES);
  await insertCourseEnrollments(300, 3);
  await insertLessons(3);
  await insertVideos(3);
  await updateCourseCount();
  await updateUserCount();

  setTimeout(() => {}, 5000);
}

main()
  .then(async () => {
    console.log("Successfully seeding database...");

    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.error("Error seeding database: ", error);

    await prisma.$disconnect;
    process.exit(1);
  });
