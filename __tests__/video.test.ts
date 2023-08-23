import request from "supertest";
import app from "../src/main";
import {
  Course,
  CourseEnrollment,
  CourseLesson,
  CourseLessonVideo,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import { UpdateCourseDto } from "../src/modules/course/course.type";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import {
  CreateCourseLessonDto,
  UpdateCourseLessonDto,
} from "../src/modules/lesson/lesson.type";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../src/modules/video/video.type";

const server = app.express;
const prisma = new PrismaClient();

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  videos: "/videos",
  video: (videoId: number) => urls.videos.concat("/", videoId.toString()),
};

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await prisma.$disconnect();
});

// Enrolled Instructor
describe("Create, Update & Delete Video", () => {
  let user: User;
  let enrollment: CourseEnrollment;
  let lesson: CourseLesson;
  let video: CourseLessonVideo;
  let loginRes: request.Response;
  const expectedStatusCode = {
    create: StatusCode.RESOURCE_CREATED,
    update: StatusCode.SUCCESS,
    delete: StatusCode.SUCCESS,
  };

  beforeAll(async () => {
    enrollment = await prisma.courseEnrollment.findFirstOrThrow({
      where: {
        role: Role.INSTRUCTOR,
      },
    });
    lesson = await prisma.courseLesson.findFirstOrThrow({
      where: {
        courseId: enrollment.courseId,
      },
    });
    video = await prisma.courseLessonVideo.findFirstOrThrow({
      where: {
        lessonId: lesson.id,
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

  it("[Enrolled INSTRUCTOR] should create video", async () => {
    const body: CreateCourseLessonVideoDto = {
      lessonId: lesson.id,
      name: "name",
      totalDurations: 12,
      youtubeLink: "youtubeLink",
    };

    const res = await request(server)
      .post(urls.videos)
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.body.message).toBe("Request success!");
    expect(res.statusCode).toBe(expectedStatusCode.create);
  });

  it("[Enrolled INSTRUCTOR] should update video", async () => {
    const body: UpdateCourseLessonVideoDto = {
      name: "newName",
    };

    const res = await request(server)
      .put(urls.video(video.id))
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.body.message).toBe("Request success!");
    expect(res.statusCode).toBe(expectedStatusCode.update);
  });

  it("[Enrolled INSTRUCTOR] should delete video", async () => {
    const res = await request(server)
      .delete(urls.video(video.id))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.body.message).toBe("Request success!");
    expect(res.statusCode).toBe(expectedStatusCode.delete);
  });
});

// Author
describe("Create, Update & Delete Video", () => {
  let user: User;
  let course: Course;
  let lesson: CourseLesson;
  let video: CourseLessonVideo;
  let loginRes: request.Response;
  const expectedStatusCode = {
    create: StatusCode.RESOURCE_CREATED,
    update: StatusCode.SUCCESS,
    delete: StatusCode.SUCCESS,
  };

  beforeAll(async () => {
    course = await prisma.course.findFirstOrThrow({});
    lesson = await prisma.courseLesson.findFirstOrThrow({
      where: {
        courseId: course.id,
      },
    });
    video = await prisma.courseLessonVideo.findFirstOrThrow({
      where: {
        lessonId: lesson.id,
      },
    });
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

  it("[Author] should create video", async () => {
    const body: CreateCourseLessonVideoDto = {
      lessonId: lesson.id,
      name: "name",
      totalDurations: 12,
      youtubeLink: "youtubeLink",
    };

    const res = await request(server)
      .post(urls.videos)
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.create);
  });

  it("[Author] should update video", async () => {
    const body: UpdateCourseLessonVideoDto = {
      name: "newName",
    };

    const res = await request(server)
      .put(urls.video(video.id))
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.update);
  });

  it("[Author] should delete lesson", async () => {
    const res = await request(server)
      .delete(urls.video(video.id))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.delete);
  });
});

// Enrolled Student
describe("Create, Update & Delete Course", () => {
  let user: User;
  let course: Course;
  let enrollment: CourseEnrollment;
  let lesson: CourseLesson;
  let video: CourseLessonVideo;
  let loginRes: request.Response;
  const expectedStatusCode = {
    create: StatusCode.UNAUTHORIZED,
    update: StatusCode.UNAUTHORIZED,
    delete: StatusCode.UNAUTHORIZED,
  };

  beforeAll(async () => {
    enrollment = await prisma.courseEnrollment.findFirstOrThrow({
      where: {
        role: Role.STUDENT,
      },
    });
    lesson = await prisma.courseLesson.findFirstOrThrow({
      where: {
        courseId: enrollment.courseId,
      },
    });
    video = await prisma.courseLessonVideo.findFirstOrThrow({
      where: {
        lessonId: lesson.id,
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

  it("[Enrolled STUDENT] shouldn't create video", async () => {
    const body: CreateCourseLessonVideoDto = {
      lessonId: lesson.id,
      name: "name",
      totalDurations: 12,
      youtubeLink: "youtubeLink",
    };

    const res = await request(server)
      .post(urls.videos)
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.create);
  });

  it("[Enrolled STUDENT] shouldn't update video", async () => {
    const body: UpdateCourseLessonVideoDto = { name: "newName" };

    const res = await request(server)
      .put(urls.video(video.id))
      .send(body)
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.update);
  });

  it("[Enrolled STUDENT] shouldn't delete video", async () => {
    const res = await request(server)
      .delete(urls.video(video.id))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(expectedStatusCode.delete);
  });
});
