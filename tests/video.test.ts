import request from "supertest";
import app from "../src/main";
import { CourseLessonVideo, PrismaClient, Role, User } from "@prisma/client";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import UserForTest, { TestObject } from "./utils/User";
import {
  CreateCourseLessonVideoDto,
  UpdateCourseLessonVideoDto,
} from "../src/modules/video/video.type";
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
    let user: User;
    let video: CourseLessonVideo;
    let loginRes: request.Response;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      video = testObject.video;
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
      const body: CreateCourseLessonVideoDto = {
        lessonId: video.lessonId,
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

    it(expectation.update, async () => {
      const body: UpdateCourseLessonVideoDto = {
        name: "newName",
      };

      const res = await request(server)
        .put(urls.video(video.id))
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.update);
    });

    it(expectation.delete, async () => {
      const res = await request(server)
        .delete(urls.video(video.id))
        .send()
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.delete);
    });
  };
}

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  videos: "/videos",
  video: (videoId: number) => urls.videos.concat("/", videoId.toString()),
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
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled STUDENT] shouldn't create video",
      update: "[Unenrolled STUDENT] shouldn't update video",
      delete: "[Unenrolled STUDENT] shouldn't delete video",
    }
  )
);

// Unenrolled INSTRUCTOR
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Unenrolled INSTRUCTOR] shouldn't create video",
      update: "[Unenrolled INSTRUCTOR] shouldn't update video",
      delete: "[Unenrolled INSTRUCTOR] shouldn't delete video",
    }
  )
);

// Unenrolled ADMIN
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Unenrolled ADMIN] should create video",
      update: "[Unenrolled ADMIN] should update video",
      delete: "[Unenrolled ADMIN] should delete video",
    }
  )
);

// Enrolled STUDENT as STUDENT
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled STUDENT as STUDENT] shouldn't create video",
      update: "[Enrolled STUDENT as STUDENT] shouldn't update video",
      delete: "[Enrolled STUDENT as STUDENT] shouldn't delete video",
    }
  )
);

// Enrolled INSTRUCTOR as STUDENT
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      create: StatusCode.UNAUTHORIZED,
      update: StatusCode.UNAUTHORIZED,
      delete: StatusCode.UNAUTHORIZED,
    },
    {
      create: "[Enrolled INSTRUCTOR as STUDENT] shouldn't create video",
      update: "[Enrolled INSTRUCTOR as STUDENT] shouldn't update video",
      delete: "[Enrolled INSTRUCTOR as STUDENT] shouldn't delete video",
    }
  )
);

// Enrolled INSTRUCTOR as INSTRUCTOR
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled INSTRUCTOR as INSTRUCTOR] should create video",
      update: "[Enrolled INSTRUCTOR as INSTRUCTOR] should update video",
      delete: "[Enrolled INSTRUCTOR as INSTRUCTOR] should delete video",
    }
  )
);

// Enrolled ADMIN as STUDENT
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.STUDENT),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as STUDENT] should create video",
      update: "[Enrolled ADMIN as STUDENT] should update video",
      delete: "[Enrolled ADMIN as STUDENT] should delete video",
    }
  )
);

// Enrolled ADMIN as INSTRUCTOR
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Enrolled ADMIN as INSTRUCTOR] should create video",
      update: "[Enrolled ADMIN as INSTRUCTOR] should update video",
      delete: "[Enrolled ADMIN as INSTRUCTOR] should delete video",
    }
  )
);

// Author & INSTRUCTOR
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.INSTRUCTOR),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & INSTRUCTOR] should create video",
      update: "[Author & INSTRUCTOR] should update video",
      delete: "[Author & INSTRUCTOR] should delete video",
    }
  )
);

// Author & ADMIN
describe(
  "Create, Update & Delete video",
  getDescribe(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.OWNER),
    {
      create: StatusCode.RESOURCE_CREATED,
      update: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      create: "[Author & ADMIN] should create video",
      update: "[Author & ADMIN] should update video",
      delete: "[Author & ADMIN] should delete video",
    }
  )
);
