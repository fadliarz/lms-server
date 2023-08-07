import { Prisma, PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import sha256Encrypt from "../src/utils/encrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const courseLikeTable = prisma.courseLike;
const courseEnrollmentTable = prisma.courseEnrollment;
const courseLessonTable = prisma.courseLesson;
const courseLessonVideoTable = prisma.courseLessonVideo;
const courseTable = prisma.course;
const profileTable = prisma.profile;
const userTable = prisma.user;

async function cleanTables() {
  await courseLikeTable.deleteMany();
  await courseEnrollmentTable.deleteMany();
  await courseLessonTable.deleteMany();
  await courseLessonVideoTable.deleteMany();
  await courseTable.deleteMany();
  await profileTable.deleteMany();
  await userTable.deleteMany();
}

function getIds(totalIds: number) {
  const ids: string[] = [];

  for (let index = 0; index < totalIds; index++) {
    ids.push(uuidv4());
  }

  return ids;
}

function generateProfileObject() {
  return {
    id: uuidv4(),
    name: faker.internet.displayName(),
    NIM: faker.number.toString(),
  };
}

async function main() {
  await cleanTables();

  /**
   * Create Students
   */
  let studentIds = getIds(3);

  let students: Prisma.UserCreateInput[];

  students = studentIds.map((studentId) => {
    return {
      id: studentId,
      email: faker.internet.email(),
      password: faker.internet.password(),
      profile: {
        create: generateProfileObject(),
      },
    };
  });

  students.forEach(async (student) => {
    await userTable.create({ data: student });
  });

  /**
   * Create First 3 Instructors
   */
  let instructorIdsOne = getIds(3);

  let instructors: Prisma.UserCreateInput[];

  instructors = instructorIdsOne.map((instructorId) => {
    return {
      id: instructorId,
      email: faker.internet.email(),
      password: faker.internet.password(),
      profile: {
        create: generateProfileObject(),
      },
      role: Role.INSTRUCTOR,
    };
  });

  instructors.map(async (instructor) => {
    await userTable.create({ data: instructor });
  });

  /**
   * Create Second 3 Instructors
   */
  let instructorIdsTwo = getIds(3);

  instructors = instructorIdsTwo.map((instructorId) => {
    return {
      id: instructorId,
      email: faker.internet.email(),
      password: sha256Encrypt(faker.internet.password()),
      profile: {
        create: generateProfileObject(),
      },
      courses: {
        create: getIds(3).map((courseId) => {
          return {
            id: courseId,
            title: faker.lorem.words(3),
            description: faker.lorem.paragraph(),
            enrollments: {
              create: [
                ...studentIds.map((studentId) => {
                  return {
                    id: uuidv4(),
                    userId: studentId,
                  };
                }),
                ...instructorIdsOne.map((instructorId) => {
                  return {
                    id: uuidv4(),
                    userId: instructorId,
                    role: Role.INSTRUCTOR,
                  };
                }),
              ],
            },
            lessons: {
              create: getIds(3).map((lessonId) => {
                return {
                  id: lessonId,
                  title: faker.lorem.words(3),
                  description: faker.lorem.paragraph(),
                };
              }),
            },
          };
        }),
      },
      role: Role.INSTRUCTOR,
    };
  });

  instructors.forEach(async (instructor) => {
    await userTable.create({
      data: instructor,
    });
  });
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
