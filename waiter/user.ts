import request from "supertest";
import app from "../src/main";
import { SignInDto, SignUpDto, userUrls } from "../src/modules/user/user.type";
import { StatusCode } from "../src/common/constants/statusCode";
import { PrismaClient, User } from "@prisma/client";

const server = app.express;
const prisma = new PrismaClient();

beforeAll(async () => {
  await prisma.$connect();

  const user = await prisma.user.findUnique({
    where: {
      email: "student@gmail.com",
    },
    select: {
      id: true,
    },
  });

  if (user) {
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    });
  }
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Sign Up User", () => {
  it("should create user", async () => {
    const body: SignUpDto = {
      email: "student@gmail.com",
      password: "student",
      NIM: "13121140",
      name: "name",
    };

    const res = await request(server)
      .post(userUrls.root.concat(userUrls.signUp))
      .send(body);

    expect(res.statusCode).toBe(StatusCode.RESOURCE_CREATED);
  });
});

describe("Sign In User", () => {
  it("should sign in user", async () => {
    const res = await request(server)
      .post(userUrls.root.concat(userUrls.signIn))
      .send({
        email: "student@gmail.com",
        password: "student",
      });

    expect(res.statusCode).toBe(StatusCode.SUCCESS);
  });
});

describe("Log Out User", () => {
  let loginRes: request.Response;
  let user: User;

  beforeAll(async () => {
    user = await prisma.user.findFirstOrThrow();

    const body: SignInDto = {
      email: user.email,
      password: "password",
    };

    try {
      loginRes = await request(server).post(userUrls.root.concat(userUrls.signIn)).send(body);
    } catch (error) {
      console.log("Error sign in...");

      throw error;
    }
  });

  it("should log out user", async () => {
    const res = await request(server)
      .put(userUrls.root.concat(userUrls.logOut))
      .send()
      .set("Cookie", [`${loginRes.header["set-cookie"]}`]);

    expect(res.statusCode).toBe(StatusCode.SUCCESS);
  });
});
