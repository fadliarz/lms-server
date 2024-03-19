import PrismaClientSingleton from "../src/common/class/PrismaClientSingleton";
import { UserRoleModel } from "../src/modules/course/course.type";
import sha256Encrypt from "../src/utils/encrypt";

const prisma = PrismaClientSingleton.getInstance();

export default async function seed() {
  await prisma.user.create({
    data: {
      email: "string@admin.com",
      password: sha256Encrypt("string"),
      role: UserRoleModel.OWNER,
      name: "admin",
      NIM: "131",
    },
  });

  await prisma.user.create({
    data: {
      email: "string@instructor.com",
      password: sha256Encrypt("string"),
      role: UserRoleModel.INSTRUCTOR,
      name: "instructor",
      NIM: "131",
    },
  });

  await prisma.user.create({
    data: {
      email: "string@student.com",
      password: sha256Encrypt("string"),
      role: UserRoleModel.STUDENT,
      name: "student",
      NIM: "131",
    },
  });

  const { id: categoryId } = await prisma.courseCategory.create({
    data: {
      title: "someTitle",
    },
  });

  const author = await prisma.user.create({
    data: {
      email: "string@author.com",
      password: sha256Encrypt("string"),
      role: UserRoleModel.INSTRUCTOR,
      name: "author",
      NIM: "131",
    },
  });

  await prisma.course.create({
    data: {
      authorId: author.id,
      title: "string",
      categoryId,
    },
  });
}
