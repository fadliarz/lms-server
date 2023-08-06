import { PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import sha256Encrypt from "../src/utils/encrypt";

const prisma = new PrismaClient();

const userTable = prisma.user;
const courseTable = prisma.course;
const courseEnrollmentTable = prisma.courseEnrollment;
const courseLessonTable = prisma.courseLesson;

async function deleteAllUsers() {
  await userTable.deleteMany();
}

async function deleteAllCourses() {
  await courseTable.deleteMany();
}

async function deleteAllCoursesEnrollments() {
  await courseEnrollmentTable.deleteMany();
}

async function main() {
  await deleteAllCoursesEnrollments();
  await deleteAllCourses();
  await deleteAllUsers();

  const owner = await userTable.create({
    data: {
      id: uuidv4(),
      email: "owner@gmail.com",
      password: sha256Encrypt("owner123"),
      role: Role.OWNER,
    },
  });

  const courseIds = [uuidv4(), uuidv4()];
  const instructor = await userTable.create({
    data: {
      id: uuidv4(),
      email: "instructor@gmail.com",
      password: sha256Encrypt("instructor123"),
      role: Role.INSTRUCTOR,
      courses: {
        create: [
          {
            id: courseIds[0],
            title: "Fundamentals of Networking Engineering",
          },
          {
            id: courseIds[1],
            title: "Fundamentals of Database Engineering",
          },
        ],
      },
    },
  });

  const student1 = await userTable.create({
    data: {
      id: uuidv4(),
      email: "student1@gmail.com",
      password: sha256Encrypt("student123"),
      courseEnrollments: {
        create: [
          {
            id: uuidv4(),
            courseId: courseIds[0],
          },
          {
            id: uuidv4(),
            courseId: courseIds[1],
          },
        ],
      },
    },
  });
  const student2 = await userTable.create({
    data: {
      id: uuidv4(),
      email: "student2@gmail.com",
      password: sha256Encrypt("student123"),
      courseEnrollments: {
        create: [
          {
            id: uuidv4(),
            courseId: courseIds[0],
          },
          {
            id: uuidv4(),
            courseId: courseIds[1],
          },
        ],
      },
    },
  });

  // await courseLessonTable.create({
  //   data: {
  //     id: uuidv4(),
  //     title: "Introduction",
  //     courseId: courseIds[0],
  //     videos: {
  //       create: [
  //         {
  //           id: uuidv4(),
  //           name: "Why we study networking?",
  //           totalDuration: 3,
  //           youtubeLink: "",
  //         },
  //         {
  //           id: uuidv4(),
  //           name: "Learning approaches",
  //           totalDuration: 5.1,
  //           youtubeLink: "",
  //         },
  //       ],
  //     },
  //   },
  // });
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
