import request from "supertest";
import app from "../src/main";
import { CourseLesson, PrismaClient, Role, User } from "@prisma/client";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import UserForTest, { TestObject } from "./utils/User";
import {
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../src/modules/lesson/lesson.type";
import seed from "../prisma/seed";

const server = app.express;
const prisma = new PrismaClient();

function getDescribe(
  getGenerateTestObjectFunction: () => Promise<TestObject>,
  expectedStatusCode: {
    create: StatusCode;
    read: StatusCode;
    update: StatusCode;
    delete: StatusCode;
  },
  expectation: {
    create: string;
    read: string;
    update: string;
    delete: string;
  }
) {
  return () => {
    let user: User;
    let lesson: CourseLesson;
    let loginRes: request.Response;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      lesson = testObject.lesson;
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
      const body: CreateCourseLessonDto = {
        title: "title",
        description: "description",
        courseId: lesson.courseId,
      };

      const res = await request(server)
        .post(urls.lessons)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.create);
    });

    it(expectation.read, async () => {
      const res = await request(server)
        .get(urls.lesson(lesson.id))
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.read);
    });

    it(expectation.update, async () => {
      const body: UpdateCourseLessonDto = {
        title: "new title",
      };

      const res = await request(server)
        .put(urls.lesson(lesson.id))
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.update);
    });

    it(expectation.delete, async () => {
      const res = await request(server)
        .delete(urls.lesson(lesson.id))
        .send()
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.delete);
    });
  };
}

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  lessons: "/lessons",
  lesson: (lessonId: number) => urls.lessons.concat("/", lessonId.toString()),
};

beforeAll(async () => {
  await prisma.$connect();

  console.log("seeding database...");
  const run = async () => {
    console.log = function () {};
    await seed().catch(async (error) => {
      console.error("Error seeding database: ", error);

      throw error;
    });
  };
  console.log("Successfully seeding database...");

  await run();
}, 60000);

afterAll(async () => {
  await prisma.$disconnect();
});

// Unenrolled STUDENT
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      read: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled STUDENT] shouldn't create lesson",
      read: "[Unenrolled STUDENT] should read lesson",
      update: "[Unenrolled STUDENT] shouldn't update lesson",
      delete: "[Unenrolled STUDENT] shouldn't delete lesson",
    }
  )
);

// Unenrolled INSTRUCTOR
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR),
    {
      create: StatusCode.UNAUTHORIZED,
      read: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled INSTRUCTOR] shouldn't create lesson",
      read: "[Unenrolled INSTRUCTOR] should read lesson",
      update: "[Unenrolled INSTRUCTOR] shouldn't update lesson",
      delete: "[Unenrolled INSTRUCTOR] shouldn't delete lesson",
    }
  )
);

// Unenrolled ADMIN
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Unenrolled ADMIN] should create lesson",
      read: "[Unenrolled ADMIN] should read lesson",
      update: "[Unenrolled ADMIN] should update lesson",
      delete: "[Unenrolled ADMIN] should delete lesson",
    }
  )
);

// Enrolled STUDENT as STUDENT
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      read: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled STUDENT as STUDENT] shouldn't create lesson",
      read: "[Enrolled STUDENT as STUDENT] should read lesson",
      update: "[Enrolled STUDENT as STUDENT] shouldn't update lesson",
      delete: "[Enrolled STUDENT as STUDENT] shouldn't delete lesson",
    }
  )
);

// Enrolled INSTRUCTOR as STUDENT
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      read: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled INSTRUCTOR as STUDENT] shouldn't create lesson",
      read: "[Enrolled INSTRUCTOR as STUDENT] should read lesson",
      update: "[Enrolled INSTRUCTOR as STUDENT] shouldn't update lesson",
      delete: "[Enrolled INSTRUCTOR as STUDENT] shouldn't delete lesson",
    }
  )
);

// Enrolled INSTRUCTOR as INSTRUCTOR
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled INSTRUCTOR as INSTRUCTOR] should create lesson",
      read: "[Enrolled INSTRUCTOR as INSTRUCTOR] should read lesson",
      update: "[Enrolled INSTRUCTOR as INSTRUCTOR] should update lesson",
      delete: "[Enrolled INSTRUCTOR as INSTRUCTOR] should delete lesson",
    }
  )
);

// Enrolled ADMIN as STUDENT
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as STUDENT] should create lesson",
      read: "[Enrolled ADMIN as STUDENT] should read lesson",
      update: "[Enrolled ADMIN as STUDENT] should update lesson",
      delete: "[Enrolled ADMIN as STUDENT] should delete lesson",
    }
  )
);

// Enrolled ADMIN as INSTRUCTOR
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as INSTRUCTOR] should create lesson",
      read: "[Enrolled ADMIN as INSTRUCTOR] should read lesson",
      update: "[Enrolled ADMIN as INSTRUCTOR] should update lesson",
      delete: "[Enrolled ADMIN as INSTRUCTOR] should delete lesson",
    }
  )
);

// Author & INSTRUCTOR
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & INSTRUCTOR] should create lesson",
      read: "[Author & INSTRUCTO] should read lesson",
      update: "[Author & INSTRUCTOR] should update lesson",
      delete: "[Author & INSTRUCTOR] should delete lesson",
    }
  )
);

// Author && ADMIN
describe(
  "Create, Read, Update & Delete Lesson",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      read: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & ADMIN] should create lesson",
      read: "[Author & ADMIN] should read lesson",
      update: "[Author & ADMIN] should update lesson",
      delete: "[Author & ADMIN] should delete lesson",
    }
  )
);
