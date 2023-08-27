import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.courseEnrollment.create({
    data: {
      userId: 2325,
      courseId: 4550
    },
  });
}

main()
  .then(async () => {})
  .catch((error) => {
    console.log("Error code: ", error.code || "Doesn't exist");

    console.log(error);
  })
  .finally(async () => {
    await prisma.$disconnect;
  });
