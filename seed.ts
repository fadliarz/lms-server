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

const main = async () => {
  const seed: SeedClient = await createSeedClient();

  await seed.$resetDatabase();

  const instructors = getIds(1, 5);

  await seed.user((x) =>
    x(5, {
      role: UserRoleModel.INSTRUCTOR,
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    }),
  );

  await seed.course(
    (x) =>
      x(instructors.length, {
        image: "https://picsum.photos/500/250?random=1",
      }),
    {
      connect: { user: instructors },
    },
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
      }),
    {
      connect: { courseLesson: courseLessons },
    },
  );

  await seed.user((x) =>
    x(100, {
      role: UserRoleModel.STUDENT,
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    }),
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
    x(50, {
      role: UserRoleModel.INSTRUCTOR,
      avatar: "https://picsum.photos/250/250?random=1",
      password: sha256Encrypt("password"),
    }),
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
