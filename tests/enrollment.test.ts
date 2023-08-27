import request from "supertest";
import app from "../src/main";
import {
  Course,
  CourseEnrollment,
  PrismaClient,
  Role,
  User,
} from "@prisma/client";
import { StatusCode } from "../src/common/constants/statusCode";
import { SignInDto, userUrls } from "../src/modules/user/user.type";
import UserForTest, { TestObject } from "./utils/User";
import seed from "../prisma/seed";
import {
  CreateCourseEnrollmentDto,
  UpdateCourseEnrollmentDto,
  courseEnrollmentUrls,
} from "../src/modules/enrollment/enrollment.type";

const server = app.express;
const prisma = new PrismaClient();

const urls = {
  login: userUrls.root.concat(userUrls.signIn),
  enrollments: courseEnrollmentUrls.root,
  enrollment: (enrollmentId: number) => {
    return courseEnrollmentUrls.root.concat("/", enrollmentId.toString());
  },
};

function getEnrollmentDescribeForUnenrolledUser(
  getGenerateTestObjectFunction: () => Promise<TestObject>,
  expectedStatusCode: {
    createStudentEnrollment: StatusCode;
    createInstructorEnrollment: StatusCode;
  },
  expectation: {
    createStudentEnrollment: string;
    createInstructorEnrollment: string;
  }
) {
  return () => {
    let loginRes: request.Response;
    let user: User;
    let course: Course;
    let enrollment = "" as unknown as CourseEnrollment | null;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      course = testObject.course;
      enrollment = testObject.enrollment;
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

    it(expectation.createStudentEnrollment, async () => {
      const body: CreateCourseEnrollmentDto = {
        role: Role.STUDENT,
        userId: user.id,
        courseId: course.id,
      };

      const res = await request(server)
        .post(urls.enrollments)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.createStudentEnrollment);
    });

    it(expectation.createInstructorEnrollment, async () => {
      if (!enrollment) {
        const duplicateEnrollment = await prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              courseId: course.id,
              userId: user.id,
            },
          },
        });

        if (duplicateEnrollment) {
          await prisma.courseEnrollment.delete({
            where: {
              id: duplicateEnrollment.id,
            },
          });
        }
      }

      const body: CreateCourseEnrollmentDto = {
        role: Role.INSTRUCTOR,
        userId: user.id,
        courseId: course.id,
      };

      const res = await request(server)
        .post(urls.enrollments)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(
        expectedStatusCode.createInstructorEnrollment
      );
    });
  };
}

function getEnrollmentDescribeForEnrolledUser(
  getGenerateTestObjectFunction: () => Promise<TestObject>,
  expectedStatusCode: {
    createStudentEnrollment: StatusCode;
    createInstructorEnrollment: StatusCode;
    updateToStudentEnrollment: StatusCode | "unexpected";
    updateToInstructorEnrollment: StatusCode | "unexpected";
    delete: StatusCode | "unexpected";
  },
  expectation: {
    createStudentEnrollment: string;
    createInstructorEnrollment: string;
    updateToStudentEnrollment: string;
    updateToInstructorEnrollment: string;
    delete: string;
  }
) {
  return () => {
    let loginRes: request.Response;
    let user: User;
    let course: Course;
    let enrollment = "" as unknown as CourseEnrollment | null;

    beforeAll(async () => {
      const testObject = await getGenerateTestObjectFunction();
      user = testObject.user;
      course = testObject.course;
      enrollment = testObject.enrollment;
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

    it(expectation.createStudentEnrollment, async () => {
      const body: CreateCourseEnrollmentDto = {
        role: Role.STUDENT,
        userId: user.id,
        courseId: course.id,
      };

      const res = await request(server)
        .post(urls.enrollments)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.createStudentEnrollment);
    });

    it(expectation.createInstructorEnrollment, async () => {
      if (!enrollment) {
        const duplicateEnrollment = await prisma.courseEnrollment.findUnique({
          where: {
            userId_courseId: {
              courseId: course.id,
              userId: user.id,
            },
          },
        });

        if (duplicateEnrollment) {
          await prisma.courseEnrollment.delete({
            where: {
              id: duplicateEnrollment.id,
            },
          });
        }
      }

      const body: CreateCourseEnrollmentDto = {
        role: Role.INSTRUCTOR,
        userId: user.id,
        courseId: course.id,
      };

      const res = await request(server)
        .post(urls.enrollments)
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(
        expectedStatusCode.createInstructorEnrollment
      );
    });

    // if (enrollment) {
    it(expectation.updateToStudentEnrollment, async () => {
      const body: UpdateCourseEnrollmentDto = { role: Role.STUDENT };

      const res = await request(server)
        .put(urls.enrollment((enrollment as CourseEnrollment).id))
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.updateToStudentEnrollment);
    });

    it(expectation.updateToInstructorEnrollment, async () => {
      const body: UpdateCourseEnrollmentDto = { role: Role.INSTRUCTOR };

      const res = await request(server)
        .put(urls.enrollment((enrollment as CourseEnrollment).id))
        .send(body)
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(
        expectedStatusCode.updateToInstructorEnrollment
      );
    });

    it(expectation.delete, async () => {
      const res = await request(server)
        .delete(urls.enrollment((enrollment as CourseEnrollment).id))
        .send()
        .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

      expect(res.statusCode).toBe(expectedStatusCode.delete);
    });
  };
  // };
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

// Unenrolled STUDENT
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForUnenrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT),
    {
      createStudentEnrollment: StatusCode.RESOURCE_CREATED,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
    },
    {
      createStudentEnrollment:
        "[Unenrolled STUDENT] should create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Unenrolled STUDENT] shouldn't create course enrollment with INSTRUCTOR role",
    }
  )
);

// Unenrolled INSTRUCTOR
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForUnenrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR),
    {
      createStudentEnrollment: StatusCode.RESOURCE_CREATED,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
    },
    {
      createStudentEnrollment:
        "[Unenrolled INSTRUCTOR] should create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Unenrolled INSTRUCTOR] shouldn't create course enrollment with INSTRUCTOR role",
    }
  )
);

// Unenrolled ADMIN
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForUnenrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER),
    {
      createStudentEnrollment: StatusCode.RESOURCE_CREATED,
      createInstructorEnrollment: StatusCode.RESOURCE_CREATED,
    },
    {
      createStudentEnrollment:
        "[Unenrolled ADMIN] should create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Unenrolled ADMIN] should create course enrollment with INSTRUCTOR role",
    }
  )
);

// Enrolled STUDENT as STUDENT
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForEnrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.STUDENT, Role.STUDENT),
    {
      createStudentEnrollment: StatusCode.BAD_REQUEST,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
      updateToStudentEnrollment: StatusCode.UNAUTHORIZED,
      updateToInstructorEnrollment: StatusCode.UNAUTHORIZED,
      delete: StatusCode.SUCCESS,
    },
    {
      createStudentEnrollment:
        "[Enrolled STUDENT as STUDENT] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Enrolled STUDENT as STUDENT] shouldn't create course enrollment with INSTRUCTOR role",
      updateToStudentEnrollment:
        "[Enrolled STUDENT as STUDENT] shouldn't update to course enrollment with STUDENT role",
      updateToInstructorEnrollment:
        "[Enrolled STUDENT as STUDENT] shouldn't update to course enrollment with INSTRUCTOR role",
      delete: "[Enrolled STUDENT as STUDENT] should delete course enrollment",
    }
  )
);

// Enrolled INSTRUCTOR as STUDENT
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForEnrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.STUDENT),
    {
      createStudentEnrollment: StatusCode.BAD_REQUEST,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
      updateToStudentEnrollment: StatusCode.UNAUTHORIZED,
      updateToInstructorEnrollment: StatusCode.UNAUTHORIZED,
      delete: StatusCode.SUCCESS,
    },
    {
      createStudentEnrollment:
        "[Enrolled INSTRUCTOR as STUDENT] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Enrolled INSTRUCTOR as STUDENT] shouldn't create course enrollment with INSTRUCTOR role",
      updateToStudentEnrollment:
        "[Enrolled INSTRUCTOR as STUDENT] shouldn't update to course enrollment with STUDENT role",
      updateToInstructorEnrollment:
        "[Enrolled INSTRUCTOR as STUDENT] shouldn't update to course enrollment with INSTRUCTOR role",
      delete:
        "[Enrolled INSTRUCTOR as STUDENT] should delete course enrollment",
    }
  )
);

// Enrolled INSTRUCTOR as INSTRUCTOR
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForEnrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.INSTRUCTOR, Role.INSTRUCTOR),
    {
      createStudentEnrollment: StatusCode.BAD_REQUEST,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
      updateToStudentEnrollment: StatusCode.UNAUTHORIZED,
      updateToInstructorEnrollment: StatusCode.UNAUTHORIZED,
      delete: StatusCode.SUCCESS,
    },
    {
      createStudentEnrollment:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't create course enrollment with INSTRUCTOR role",
      updateToStudentEnrollment:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't update to course enrollment with STUDENT role",
      updateToInstructorEnrollment:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] shouldn't update to course enrollment with INSTRUCTOR role",
      delete:
        "[Enrolled INSTRUCTOR as INSTRUCTOR] should delete course enrollment",
    }
  )
);

// Enrolled ADMIN as STUDENT
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForEnrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.STUDENT),
    {
      createStudentEnrollment: StatusCode.BAD_REQUEST,
      createInstructorEnrollment: StatusCode.BAD_REQUEST,
      updateToStudentEnrollment: StatusCode.BAD_REQUEST,
      updateToInstructorEnrollment: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      createStudentEnrollment:
        "[Enrolled ADMIN as STUDENT] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Enrolled ADMIN as STUDENT] shouldn't create course enrollment with INSTRUCTOR role",
      updateToStudentEnrollment:
        "[Enrolled ADMIN as STUDENT] shouldn't update to course enrollment with STUDENT role",
      updateToInstructorEnrollment:
        "[Enrolled ADMIN as STUDENT] should update to course enrollment with INSTRUCTOR role",
      delete: "[Enrolled ADMIN as STUDENT] should delete course enrollment",
    }
  )
);

// Enrolled ADMIN as INSTRUCTOR
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForEnrolledUser(
    UserForTest.getGenerateTestObjectFunction(Role.OWNER, Role.INSTRUCTOR),
    {
      createStudentEnrollment: StatusCode.BAD_REQUEST,
      createInstructorEnrollment: StatusCode.BAD_REQUEST,
      updateToStudentEnrollment: StatusCode.SUCCESS,
      updateToInstructorEnrollment: StatusCode.SUCCESS,
      delete: StatusCode.SUCCESS,
    },
    {
      createStudentEnrollment:
        "[Enrolled ADMIN as INSTRUCTOR] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Enrolled ADMIN as INSTRUCTOR] shouldn't create course enrollment with INSTRUCTOR role",
      updateToStudentEnrollment:
        "[Enrolled ADMIN as INSTRUCTOR] should update to course enrollment with STUDENT role",
      updateToInstructorEnrollment:
        "[Enrolled ADMIN as INSTRUCTOR] should update to course enrollment with INSTRUCTOR role",
      delete: "[Enrolled ADMIN as INSTRUCTOR] should delete course enrollment",
    }
  )
);

// Author & INSTRUCTOR
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForUnenrolledUser(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.INSTRUCTOR),
    {
      createStudentEnrollment: StatusCode.UNAUTHORIZED,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
    },
    {
      createStudentEnrollment:
        "[Author & INSTRUCTOR] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Author & INSTRUCTOR] shouldn't create course enrollment with INSTRUCTOR role",
    }
  )
);

// Author & ADMIN
describe(
  "Create, Update, and Delete Course Enrollment With Identical userId ",
  getEnrollmentDescribeForUnenrolledUser(
    UserForTest.getGenerateTestObjectFunctionForAuthor(Role.OWNER),
    {
      createStudentEnrollment: StatusCode.UNAUTHORIZED,
      createInstructorEnrollment: StatusCode.UNAUTHORIZED,
    },
    {
      createStudentEnrollment:
        "[Author & ADMIN] shouldn't create course enrollment with STUDENT role",
      createInstructorEnrollment:
        "[Author & ADMIN] shouldn't create course enrollment with INSTRUCTOR role",
    }
  )
);
