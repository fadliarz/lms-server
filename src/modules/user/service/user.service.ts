import jwt from "jsonwebtoken";
import { isEqual } from "lodash";
import sha256Encrypt from "../../../utils/encrypt";
import { Me, CreateUserDto, UserModel } from "../user.type";
import { IUserRepository } from "../repository/user.repository";
import { injectable, inject } from "inversify";
import { UserDITypes } from "../user.type";
import HttpException from "../../../common/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import getValuable from "../../../common/functions/getValuable";
import validateEnv from "../../../common/functions/validateEnv";
import { User } from "@prisma/client";
import { CourseDITypes } from "../../course/course.type";
import { ICourseRepository } from "../../course/repository/course.repository";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";

export interface IUserService {
  createUser: (userDetails: CreateUserDto) => Promise<UserModel>;
  getUserById: (userId: number) => Promise<UserModel | null>;
  getUserByEmail: (email: string) => Promise<UserModel | null>;
  getMe: (userId: number) => Promise<Me>;
  updateUser: (
    userId: number,
    userDetails: Partial<User>
  ) => Promise<UserModel>;
  updateUserPassword: (userId: number, password: string) => Promise<UserModel>;
  deleteUser: (userId: number) => Promise<{}>;
  signInUser: (email: string, password: string) => Promise<UserModel>;
  clearUserAuthenticationToken: (userId: number) => Promise<void>;
}

@injectable()
export class UserService implements IUserService {
  @inject(UserDITypes.REPOSITORY)
  private repository: IUserRepository;

  private generateFreshAuthenticationToken(
    type: "accessToken" | "refreshToken",
    email: string
  ): string {
    const env = validateEnv();
    let privateKey = env.ACCESS_TOKEN_PRIVATE_KEY;

    if (type === "refreshToken") {
      privateKey = env.REFRESH_TOKEN_PRIVATE_KEY;
    }

    return jwt.sign({ email }, privateKey as string, {
      expiresIn: Math.floor(Date.now()) + 1000 * 60 * 60 * 24 * 30, // 30 Days
    });
  }

  private verifyPassword(password: string, encryptedPassword: string): boolean {
    return isEqual(sha256Encrypt(password), encryptedPassword);
  }

  public async createUser(payload: CreateUserDto): Promise<UserModel> {
    const { email, password } = payload;
    const existingUser = await this.repository.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.BAD_REQUEST,
        (
          ErrorMessage[ErrorCode.UNIQUE_CONSTRAINT] as (
            field?: string
          ) => string
        )("email"),
        true
      );
    }

    const accessToken = this.generateFreshAuthenticationToken(
      "accessToken",
      email
    );
    const refreshToken = this.generateFreshAuthenticationToken(
      "refreshToken",
      email
    );
    const encryptedPassword = sha256Encrypt(password);
    payload.password = encryptedPassword;
    const newUser = await this.repository.createUser(
      payload,
      accessToken,
      refreshToken
    );

    return getValuable(newUser);
  }

  public async getUserById(userId: number): Promise<UserModel | null> {
    const user = await this.repository.getUserById(userId);

    if (!user) {
      return user;
    }

    user.password = "";

    return getValuable(user);
  }

  public async getUserByEmail(email: string): Promise<UserModel | null> {
    const user = await this.repository.getUserByEmail(email);

    if (!user) {
      return user;
    }

    user.password = "";

    return getValuable(user);
  }

  public async getMe(userId: number) {
    const me = await this.repository.getMe(userId);

    me.password = "";

    return me;
  }

  public async updateUser(
    userId: number,
    userDetails: Partial<User>
  ): Promise<UserModel> {
    const updatedUser = await this.repository.updateUser(userId, userDetails);

    return getValuable(updatedUser);
  }

  public async updateUserPassword(
    userId: number,
    password: string
  ): Promise<UserModel> {
    const updatedUser = await this.repository.updateUserPassword(
      userId,
      password
    );

    return getValuable(updatedUser);
  }

  public async deleteUser(userId: number) {
    await this.repository.deleteUser(userId);

    return {};
  }

  async signInUser(email: string, password: string): Promise<UserModel> {
    const userBelongToSignInEmail = await this.repository.getUserByEmail(email);
    if (!userBelongToSignInEmail) {
      throw new HttpException(
        StatusCode.NOT_FOUND,
        ErrorCode.RESOURCE_NOT_FOUND,
        ErrorMessage[ErrorCode.RESOURCE_NOT_FOUND] as string,
        true
      );
    }

    const isPasswordMatch = this.verifyPassword(
      password,
      userBelongToSignInEmail.password
    );
    if (!isPasswordMatch) {
      throw new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.BAD_REQUEST,
        ErrorMessage[ErrorCode.FAILED_ON_AUTHENTICATION] as string,
        true
      );
    }

    const accessToken = this.generateFreshAuthenticationToken(
      "accessToken",
      email
    );
    const refreshToken = this.generateFreshAuthenticationToken(
      "refreshToken",
      email
    );
    const user = {
      ...userBelongToSignInEmail,
      accessToken,
      refreshToken,
    };

    await this.repository.updateUser(user.id, {
      accessToken,
      refreshToken,
    });

    return getValuable(user);
  }

  public async clearUserAuthenticationToken(userId: number) {
    await this.repository.updateUser(userId, {
      accessToken: "",
    });
  }
}
