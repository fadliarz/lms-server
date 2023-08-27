import { PrismaClient } from "@prisma/client";
import seed from "./seed";

const prisma = new PrismaClient();

seed()
  .then(async () => {
    console.log("Successfully seeding database...");

    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.error("Error seeding database: ", error);

    await prisma.$disconnect;
    process.exit(1);
  });
