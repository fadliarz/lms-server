import request from "supertest";
import app from "../src/main";
import { Course, PrismaClient, Role, User } from "@prisma/client";
import {
  CreateCourseDto,
  UpdateCourseDto,
  courseUrls,
} from "../src/modules/course/course.type";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import UserForTest, { TestObject } from "../test-utils/User";
import seed from "../prisma/seed";

const server = app.express;
const prisma = new PrismaClient();

function getDescribe(
  getGenerateTestObjectFunction: () => Promise<TestObject>,
  expectedStatusCode: {
    create: StatusCode;
    update: StatusCode;
    delete: StatusCode;
  },
  expectation: {
    create: string;
    update: string;
    delete: string;
  }
) {
  return () => {
    let loginRes: request.Response;
    let user: User;
    let course: Course;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      course = testObject.course;
    });

    beforeEach(async () => {
      const body: SignInDto = {
        email: user.email,
        password: "password",
      };

      try {
        loginRes = await request(server).post(urls.login).send(body);
      } catch (error) {
        console.log("Error sign in...");

        throw error;
      }
    });

    it(expectation.create, async () => {
      const body: CreateCourseDto = {
        title: "title",
      };

      const res = await request(server)
        .post(urls.courses)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.create);
    });

    it(expectation.update, async () => {
      const body: UpdateCourseDto = { title: "new title" };

      const res = await request(server)
        .put(urls.course(course.id))
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.update);
    });

    it(expectation.delete, async () => {
      const res = await request(server)
        .delete(urls.course(course.id))
        .send()
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.delete);
    });
  };
}

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  courses: courseUrls.root,
  course: (courseId: number) =>
    courseUrls.root.concat("/", courseId.toString()),
};

beforeAll(async () => {
  await prisma.$connect();

  console.log("seeding database...");
  await seed()
    .then(async () => {
      console.log("Successfully seeding database...");
    })
    .catch(async (error) => {
      console.error("Error seeding database: ", error);

      throw error;
    });
}, 60000);

afterAll(async () => {
  await prisma.$disconnect();
});

// Unenrolled STUDENT
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled STUDENT] shouldn't create course",
      update: "[Unenrolled STUDENT] shouldn't update course",
      delete: "[Unenrolled STUDENT] shouldn't delete course",
    }
  )
);

// Unenrolled INSTRUCTOR
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled INSTRUCTOR] should create course",
      update: "[Unenrolled INSTRUCTOR] shouldn't update course",
      delete: "[Unenrolled INSTRUCTOR] shouldn't delete course",
    }
  )
);

// Unenrolled ADMIN
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Unenrolled ADMIN] should create course",
      update: "[Unenrolled ADMIN] should update course",
      delete: "[Unenrolled ADMIN] should delete course",
    }
  )
);

// Enrolled STUDENT as STUDENT
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled STUDENT as STUDENT] shouldn't create course",
      update: "[Enrolled STUDENT as STUDENT] shouldn't update course",
      delete: "[Enrolled STUDENT as STUDENT] shouldn't delete course",
    }
  )
);

// Enrolled INSTRUCTOR as STUDENT
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled INSTRUCTOR as STUDENT] should create course",
      update: "[Enrolled INSTRUCTOR as STUDENT] shouldn't update course",
      delete: "[Enrolled INSTRUCTOR as STUDENT] shouldn't delete course",
    }
  )
);

// Enrolled INSTRUCTOR as INSTRUCTOR
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled INSTRUCTOR as INSTRUCTOR] should create course",
      update: "[Enrolled INSTRUCTOR as INSTRUCTOR] should update course",
      delete: "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't delete course",
    }
  )
);

// Enrolled ADMIN as STUDENT
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as STUDENT] should create course",
      update: "[Enrolled ADMIN as STUDENT] should update course",
      delete: "[Enrolled ADMIN as STUDENT] should delete course",
    }
  )
);

// Enrolled ADMIN as INSTRUCTOR
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as INSTRUCTOR] should create course",
      update: "[Enrolled ADMIN as INSTRUCTOR] should update course",
      delete: "[Enrolled ADMIN as INSTRUCTOR] should delete course",
    }
  )
);

// Author & INSTRUCTOR
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & INSTRUCTOR] should create course",
      update: "[Author & INSTRUCTOR] should update course",
      delete: "[Author & INSTRUCTOR] should delete course",
    }
  )
);

// Author & ADMIN
describe(
  "Create, Update & Delete Course",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & ADMIN] should create course",
      update: "[Author & ADMIN] should update course",
      delete: "[Author & ADMIN] should delete course",
    }
  )
);
