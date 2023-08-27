import request from "supertest";
import app from "../src/main";
import { Course, CourseLike, PrismaClient, Role, User } from "@prisma/client";
import {
  CreateCourseDto,
  CreateCourseLikeDto,
  GetCourseQuery,
  GetCoursesQuery,
  UpdateCourseDto,
  courseUrls,
} from "../src/modules/course/course.type";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import UserForTest, { TestObject } from "./utils/User";
import seed from "../prisma/seed";

const server = app.express;
const prisma = new PrismaClient();

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  courses: courseUrls.root,
  course: (courseId: number) =>
    courseUrls.root.concat("/", courseId.toString()),
  likes: courseUrls.root.concat(courseUrls.likes),
  like: (likeId: number) =>
    courseUrls.root.concat(courseUrls.likes, "/", likeId.toString()),
};

function getCourseDescribe(
  getGenerateTestObjectFunction: () => Promise<TestObject>,
  expectedStatusCode: {
    create: StatusCode;
    readOne: StatusCode;
    readOneIncludeVideos: StatusCode;
    readMany: StatusCode;
    readManyInstructorAndOwnedCourses: StatusCode;
    update: StatusCode;
    delete: StatusCode;
    createLike: StatusCode;
    deleteLike: StatusCode;
  },
  expectation: {
    create: string;
    readOne: string;
    readOneIncludeVideos: string;
    readMany: string;
    readManyInstructorAndOwnedCourses: string;
    update: string;
    delete: string;
    createLike: string;
    deleteLike: string;
  }
) {
  return () => {
    let loginRes: request.Response;
    let user: User;
    let course: Course;
    let like: CourseLike;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      course = testObject.course;
      like = testObject.like;
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

    it(expectation.deleteLike, async () => {
      const res = await request(server)
        .delete(urls.like(like.id))
        .send()
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.deleteLike);
    });

    it(expectation.createLike, async () => {
      const body: CreateCourseLikeDto = {
        courseId: course.id,
      };

      const res = await request(server)
        .post(urls.likes)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.createLike);
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

    it(expectation.readOne, async () => {
      const res = await request(server)
        .get(urls.course(course.id))
        .set("Cookie", [`${loginRes.header["set-cookie"]}`])
        .query({
          include_author: "true",
          include_instructors: "true",
          include_lessons: "true",
          include_students: "true",
        } satisfies GetCourseQuery);

      expect(res.statusCode).toBe(expectedStatusCode.readOne);
    });

    it(expectation.readOneIncludeVideos, async () => {
      const res = await request(server)
        .get(urls.course(course.id))
        .set("Cookie", [`${loginRes.header["set-cookie"]}`])
        .query({
          include_author: "true",
          include_instructors: "true",
          include_lessons: "true",
          include_students: "true",
          include_videos: "true",
        } satisfies GetCourseQuery);

      expect(res.statusCode).toBe(expectedStatusCode.readOneIncludeVideos);
    });

    it(expectation.readMany, async () => {
      const res = await request(server)
        .get(urls.courses)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`])
        .query({ include_student_courses: "true" } satisfies GetCoursesQuery);

      expect(res.statusCode).toBe(expectedStatusCode.readMany);
    });

    it(expectation.readManyInstructorAndOwnedCourses, async () => {
      const res = await request(server)
        .get(urls.courses)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`])
        .query({
          include_student_courses: "true",
          include_instructor_courses: "true",
          include_owned_courses: "true",
        } satisfies GetCoursesQuery);

      expect(res.statusCode).toBe(
        expectedStatusCode.readManyInstructorAndOwnedCourses
      );
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

//Unenrolled STUDENT
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.UNAUTHORIZED,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled STUDENT] shouldn't create course",
      readOne: "[Unenrolled STUDENT] should read course",
      readOneIncludeVideos:
        "[Unenrolled STUDENT] shouldn't read course include videos",
      readMany: "[Unenrolled STUDENT] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Unenrolled STUDENT] shouldn't read instructor and owned courses",
      update: "[Unenrolled STUDENT] shouldn't update course",
      delete: "[Unenrolled STUDENT] shouldn't delete course",
      createLike: "[Unenrolled STUDENT] shouldn't create course like",
      deleteLike: "[Unenrolled STUDENT] shouldn't delete course like",
    }
  )
);

// Unenrolled INSTRUCTOR
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.UNAUTHORIZED,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled INSTRUCTOR] should create course",
      readOne: "[Unenrolled INSTRUCTOR] should read course",
      readOneIncludeVideos:
        "[Unenrolled INSTRUCTOR] shouldn't read course include videos",
      readMany: "[Unenrolled INSTRUCTOR] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Unenrolled INSTRUCTOR] should read instructor and owned courses",
      update: "[Unenrolled INSTRUCTOR] shouldn't update course",
      delete: "[Unenrolled INSTRUCTOR] shouldn't delete course",
      createLike: "[Unenrolled INSTRUCTOR] shouldn't create course like",
      deleteLike: "[Unenrolled INSTRUCTOR] shouldn't delete course like",
    }
  )
);

// Unenrolled ADMIN
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled ADMIN] should create course",
      readOne: "[Unenrolled ADMIN] should read course",
      readOneIncludeVideos:
        "[Unenrolled ADMIN] should read course include videos",
      readMany: "[Unenrolled ADMIN] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Unenrolled ADMIN] should read instructor and owned courses",
      update: "[Unenrolled ADMIN] should update course",
      delete: "[Unenrolled ADMIN] should delete course",
      createLike: "[Unenrolled ADMIN] shouldn't create course like",
      deleteLike: "[Unenrolled ADMIN] shouldn't delete course like",
    }
  )
);

// Enrolled STUDENT as STUDENT
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
      createLike: StatusCode.RESOURCE_CREATED,
      deleteLike: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled STUDENT as STUDENT] shouldn't create course",
      readOne: "[Enrolled STUDENT as STUDENT] should read course",
      readOneIncludeVideos:
        "[Enrolled STUDENT as STUDENT] should read course include videos",
      readMany: "[Enrolled STUDENT as STUDENT] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Enrolled STUDENT as STUDENT] shouldn't read instructor and owned courses",
      update: "[Enrolled STUDENT as STUDENT] shouldn't update course",
      delete: "[Enrolled STUDENT as STUDENT] shouldn't delete course",
      createLike: "[Enrolled STUDENT as STUDENT] should create course like",
      deleteLike: "[Enrolled STUDENT as STUDENT] should delete course like",
    }
  )
);

// Enrolled INSTRUCTOR as STUDENT
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
      createLike: StatusCode.RESOURCE_CREATED,
      deleteLike: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled INSTRUCTOR as STUDENT] should create course",
      readOne: "[Enrolled INSTRUCTOR as STUDENT] should read course",
      readOneIncludeVideos:
        "[Enrolled INSTRUCTOR as STUDENT] should read course include videos",
      readMany: "[Enrolled INSTRUCTOR as STUDENT] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Enrolled INSTRUCTOR as STUDENT] should read instructor and owned courses",
      update: "[Enrolled INSTRUCTOR as STUDENT] shouldn't update course",
      delete: "[Enrolled INSTRUCTOR as STUDENT] shouldn't delete course",
      createLike: "[Enrolled INSTRUCTOR as STUDENT] should create course like",
      deleteLike: "[Enrolled INSTRUCTOR as STUDENT] should delete course like",
    }
  )
);

// Enrolled INSTRUCTOR as INSTRUCTOR
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.UNAUTHORIZED,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled INSTRUCTOR as INSTRUCTOR] should create course",
      readOne: "[Enrolled INSTRUCTOR as INSTRUCTOR] should read course",
      readOneIncludeVideos:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] should read course include videos",
      readMany: "[Enrolled INSTRUCTOR as INSTRUCTOR] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] should read instructor and owned courses",
      update: "[Enrolled INSTRUCTOR as INSTRUCTOR] should update course",
      delete: "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't delete course",
      createLike:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't create course like",
      deleteLike:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't delete course like",
    }
  )
);

// Enrolled ADMIN as STUDENT
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
      createLike: StatusCode.RESOURCE_CREATED,
      deleteLike: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as STUDENT] should create course",
      readOne: "[Enrolled ADMIN as STUDENT] should read course",
      readOneIncludeVideos:
        "[Enrolled ADMIN as STUDENT] should read course include videos",
      readMany: "[Enrolled ADMIN as STUDENT] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Enrolled ADMIN as STUDENT] should read instructor and owned courses",
      update: "[Enrolled ADMIN as STUDENT] should update course",
      delete: "[Enrolled ADMIN as STUDENT] should delete course",
      createLike: "[Enrolled ADMIN as STUDENT] should create course like",
      deleteLike: "[Enrolled ADMIN as STUDENT] should delete course like",
    }
  )
);

// Enrolled ADMIN as INSTRUCTOR
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled ADMIN as INSTRUCTOR] should create course",
      readOne: "[Enrolled ADMIN as INSTRUCTOR] should read course",
      readOneIncludeVideos:
        "[Enrolled ADMIN as INSTRUCTOR] should read course include videos",
      readMany: "[Enrolled ADMIN as INSTRUCTOR] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Enrolled ADMIN as INSTRUCTOR] should read instructor and owned courses",
      update: "[Enrolled ADMIN as INSTRUCTOR] should update course",
      delete: "[Enrolled ADMIN as INSTRUCTOR] should delete course",
      createLike: "[Enrolled ADMIN as INSTRUCTOR] shouldn't create course like",
      deleteLike: "[Enrolled ADMIN as INSTRUCTOR] shouldn't delete course like",
    }
  )
);

// Author & INSTRUCTOR
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Author & INSTRUCTOR] should create course",
      readOne: "[Author & INSTRUCTOR] should read course",
      readOneIncludeVideos:
        "[Author & INSTRUCTOR] should read course include videos",
      readMany: "[Author & INSTRUCTOR] should read courses",
      readManyInstructorAndOwnedCourses:
        "[Author & INSTRUCTOR] should read instructor and owned courses",
      update: "[Author & INSTRUCTOR] should update course",
      delete: "[Author & INSTRUCTOR] should delete course",
      createLike: "[Author & INSTRUCTOR] shouldn't create course like",
      deleteLike: "[Author & INSTRUCTOR] shouldn't delete course like",
    }
  )
);

// Author & ADMIN
describe(
  "Create, Update & Delete Course; Create & Delete Course Like",
  getCourseDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      readOne: StatusCode.SUCCESS,
      readOneIncludeVideos: StatusCode.SUCCESS,
      readMany: StatusCode.SUCCESS,
      readManyInstructorAndOwnedCourses: StatusCode.SUCCESS,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
      createLike: StatusCode.UNAUTHORIZED,
      deleteLike: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Author & ADMIN] should create course",
      readOne: "[Author & ADMIN] should read course",
      readOneIncludeVideos:
        "[Author & ADMIN] should read course include videos",
      readMany: "[Author & ADMIN] should read courses",
      readManyInstructorAndOwnedCourses:
        "[[Author & ADMIN] should read instructor and owned courses",
      update: "[Author & ADMIN] should update course",
      delete: "[Author & ADMIN] should delete course",
      createLike: "[Author & ADMIN] shouldn't create course like",
      deleteLike: "[Author & ADMIN] shouldn't delete course like",
    }
  )
);
