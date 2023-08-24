import request from "supertest";
import app from "../src/main";
import {
  Course,
  CourseEnrollment,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import {
  CreateCourseDto,
  UpdateCourseDto,
  courseUrls,
} from "../src/modules/course/course.type";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";

const server = app.express;
const prisma = new PrismaClient();

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  courses: courseUrls.root,
  course: (courseId: number) =>
    courseUrls.root.concat("/", courseId.toString()),
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Enrolled Instructor
describe("Create, Update & Delete Course", () => {
  let user: User;
  let course: Course;
  let enrollment: CourseEnrollment;
  let loginRes: request.Response;
  const expectedStatusCode = {
    create: StatusCode.RESOURCE_CREATED,
    update: StatusCode.SUCCESS,
    delete: StatusCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    enrollment = await prisma.courseEnrollment.findFirstOrThrow({
      where: {
        role: Role.INSTRUCTOR,
      },
    });

    user = await prisma.user.findFirstOrThrow({
      where: {
        id: enrollment.userId,
      },
    });
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

  it("[Enrolled INSTRUCTOR] should create course", async () => {
    const body: CreateCourseDto = {
      title: "title",
    };

    const res = await request(server)
      .post(urls.courses)
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.create);
  });

  it("[Enrolled INSTRUCTOR] should update course", async () => {
    const body: UpdateCourseDto = { title: "new title" };

    const res = await request(server)
      .put(urls.course(enrollment.courseId))
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.update);
  });

  it("[Enrolled INSTRUCTOR] shouldn't delete course", async () => {
    const res = await request(server)
      .delete(urls.course(enrollment.courseId))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.delete);
  });
});

// Instructor & Author
describe("Create, Update & Delete Course", () => {
  let loginRes: request.Response;
  let user: User;
  let course: Course;
  const expectedStatusCode = {
    create: StatusCode.RESOURCE_CREATED,
    update: StatusCode.SUCCESS,
    delete: StatusCode.SUCCESS,
  };

  beforeAll(async () => {
    course = await prisma.course.findFirstOrThrow({});
    user = await prisma.user.findFirstOrThrow({
      where: {
        id: course.authorId,
      },
    });
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

  it("[INSTRUCTOR & Author] should create course", async () => {
    const body: CreateCourseDto = {
      title: "title",
    };

    const res = await request(server)
      .post(urls.courses)
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.create);
  });

  it("[INSTRUCTOR & Author] should update course", async () => {
    const body: UpdateCourseDto = { title: "new title" };

    const res = await request(server)
      .put(urls.course(course.id))
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.update);
  });

  it("[INSTRUCTOR & Author] should delete course", async () => {
    const res = await request(server)
      .delete(urls.course(course.id))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.delete);
  });
});
