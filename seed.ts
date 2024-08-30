/**
 * ! Executing this script will delete all data in your database and seed it with 10 user.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
// @ts-ignore
// @ts-nocheck
import { createSeedClient } from "@snaplet/seed";
import { SeedClient } from "@snaplet/seed/dist/assets";
import { CourseEnrollmentRoleModel, UserRoleModel } from "./src/modules/course/course.type";
import sha256Encrypt from "./src/utils/encrypt";
import { PrismaClient } from "@prisma/client";

const main = async () => {
  const seed: SeedClient = await createSeedClient();

  const prisma = new PrismaClient();

  await seed.$resetDatabase();

  const instructors = getIds(1, 5);

  await seed.user((x) =>
    x(5, ({ seed }) => ({
      email:
        `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    })),
  );

  await seed.course((x) =>
    x(instructors.length, {
      image: "https://picsum.photos/500/250?random=1",
    }),
  );

  const courses = getIds(1, instructors.length);

  await seed.courseLesson((x) => x(5 * courses.length), {
    connect: {
      course: courses,
    },
  });

  const courseLessons = getIds(1, 5 * courses.length);

  await seed.courseLessonVideo(
    (x) =>
      x(10 * courseLessons.length, {
        youtubeLink:
          "https://www.youtube.com/watch?v=NyOYW07-L5g&ab_channel=TheOrganicChemistryTutor",
        attachment:
          "https://libgen.is/book/index.php?md5=BBFE90154D738CC2BA66088F31CBCD5F",
      }),
    {
      connect: { courseLesson: courseLessons },
    },
  );

  await seed.user((x) =>
    x(100, ({ seed }) => ({
      role: UserRoleModel.STUDENT,
      email:
        `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    })),
  );

  const students = getIds(6, 105);

  await seed.courseEnrollment(
    (x) =>
      x(300, {
        role: CourseEnrollmentRoleModel.STUDENT,
      }),
    {
      connect: {
        user: students,
        course: courses,
      },
    },
  );

  const secondInstructors = getIds(106, 155);

  await seed.user((x) =>
    x(50, ({ seed }) => ({
      role: UserRoleModel.INSTRUCTOR,
      email:
        `${seed.replace(/[^\w\s]/gi, "")}@mahasiswa.itb.ac.id`.toLowerCase(),
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    })),
  );

  await seed.courseEnrollment(
    (x) =>
      x(50, {
        role: CourseEnrollmentRoleModel.INSTRUCTOR,
      }),
    {
      connect: {
        user: secondInstructors,
        course: courses,
      },
    },
  );

  let num = 5;
  const classes = getIds(1, courses.length * num);

  await seed.courseClass((x) => x(classes.length), {
    connect: {
      course: courses,
    },
  });

  num = 10;
  const assignments = getIds(1, classes.length * num);
  await seed.courseClassAssignment((x) => x(assignments.length), {
    connect: {
      courseClass: classes,
    },
  });

  await seed.report(
    (x) =>
      x(155, {
        performance: 3.78,
      }),
    {
      connect: { user: getIds(1, 155) },
    },
  );

  await seed.courseSchedule((x) => x(50), {
    connect: { course: getIds(1, 5) },
  });

  await seed.scholarship((x) => x(100));
  await seed.competition((x) => x(100));
  await seed.event((x) => x(100));

  await seed.department((x) => x(10), {
    connect: { user: getIds(1, 30) },
  });

  await seed.personalAssignment((x) => x(750), {
    connect: { user: getIds(1, 150) },
  });

  const a = getIds(31, 50);
  const b = getIds(51, 70);
  for (let i = 0; i < 20; i++) {
    await seed.departmentDivision(
      (x) =>
        x(1, {
          leaderId: a[i].id,
          coLeaderId: b[i].id,
          departmentId: (i % 10) + 1,
        }),
      {},
    );
  }

  await seed.departmentDivisionEnrollment((x) => x(60), {
    connect: { departmentDivision: getIds(1, 20), user: getIds(71, 90) },
  });

  for (let i = 0; i < 50; i++) {
    await seed.departmentProgram((x) => x(1, { departmentId: (i % 10) + 1 }));
  }

  await seed.departmentProgramEnrollment((x) => x(750), {
    connect: { departmentProgram: getIds(1, 50), user: getIds(1, 150) },
  });

  /**
   * Product
   *
   */

  await seed.product((x) => x(5));

  await seed.productVariant((x) => x(25), {
    connect: { product: getIds(1, 5) },
  });

  await seed.order(
    (x) =>
      x(155 * 2, ({ seed }) => ({
        isArrived: Math.random() < 0.5,
        rating: Math.floor(Math.random() * (5 - 1 + 1)) + 1,
        variant_snapshot: { id: 1 },
      })),
    {
      connect: { user: getIds(1, 155), productVariant: getIds(1, 25) },
    },
  );

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      variant: {
        select: {
          id: true,
          title: true,
          price: true,
          stock: true,
          product: {
            select: {
              id: true,
              title: true,
              description: true,
            },
          },
        },
      },
    },
  });

  for (const order of orders) {
    await prisma.order.update({
      where: { id: order.id },
      data: { variantSnapshot: order.variant },
    });

    console.log("order updated!");
  }

  console.log("Database seeded successfully!");

  process.exit();
};

function getIds(start: number, end: number): Array<{ id: number }> {
  const res: Array<{ id: number }> = [];

  let i: number;
  for (i = start; i <= end; i++) {
    res.push({ id: i });
  }

  return res;
}

main();
