import { faker } from "@faker-js/faker";
import { PrismaClient, Role } from "@prisma/client";
import { CreateCourseDto } from "../../../modules/course/course.type";
import getValuable from "../getValuable";
import { UserModel } from "../../../modules/user/user.type";

const prisma = new PrismaClient();

export async function createRandomUser(userRole: Role): Promise<UserModel> {
  const user = await prisma.user.create({
    data: {
      email: faker.string.alpha(16).concat("@gmail.com"),
      password: faker.string.alpha(16),
      name: faker.string.alpha(16),
      NIM: faker.number.int({ min: 13121000, max: 13121300 }).toString(),
      dateOfBirth: new Date(),
      address: faker.string.alpha(16),
      bloodType: faker.string.alpha(2).toUpperCase(),
      lineId: faker.string.alpha(10),
      emergencyNumber: faker.string.alpha(10),
    },
  });

  return getValuable(user);
}

export async function createRandomCategory() {
  const category = await prisma.courseCategory.create({
    data: {
      title: faker.string.alpha(8),
    },
  });

  return category;
}

export async function createRandomCourse(userRole: Role) {
  const category = await createRandomCategory();
  const user = await createRandomUser(userRole);

  const course = await prisma.course.create({
    data: {
      code: faker.string.alpha(5),
      title: faker.string.alpha(8),
      authorId: user.id,
      categoryId: category.id,
    },
  });

  return course;
}

export async function createRandomCourses(
  userRole: Role,
  numberOfCourses: number,
) {
  const category = await createRandomCategory();
  const user = await createRandomUser(userRole);

  let arg: {
    title: string;
    authorId: number;
    categoryId: number;
    code: string;
  }[] = [];
  for (let i = 0; i < numberOfCourses; i++) {
    arg.push({
      title: faker.string.alpha(8),
      authorId: user.id,
      categoryId: category.id,
      code: faker.string.alpha(10),
    });
  }

  const courses = await prisma.course.createMany({
    data: arg,
  });

  return courses;
}

export function generateRandomCreateCourseDto(
  categoryId: number,
): CreateCourseDto {
  return {
    title: faker.string.alpha(8),
    code: faker.string.alpha(10),
    categoryId,
    image: faker.string.alpha(16),
    description: faker.string.alpha(16),
    material: faker.string.alpha(16),
  };
}
