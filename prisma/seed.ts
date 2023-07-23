import { PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

import { User } from "@prisma/client";

const userTable = prisma.user;

async function main() {
  const student = await userTable.create({
    data: {
      id: uuidv4(),
      email: "student@gmail.com",
      password: "Student123",
    },
  });

  const instructor = await userTable.create({
    data: {
      id: uuidv4(),
      email: "student@gmail.com",
      password: "Student123",
      role: Role.INSTRUCTOR,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect;
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect
    process.exit(1)
  });
