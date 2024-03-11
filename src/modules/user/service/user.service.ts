import "reflect-metadata";
import jwt from "jsonwebtoken";
import { isEqual } from "lodash";
import sha256Encrypt from "../../../utils/encrypt";
import { CreateUserDto, Me, UserDITypes, UserModel } from "../user.type";
import { IUserRepository } from "../repository/user.repository";
import { inject, injectable } from "inversify";
import HttpException from "../../../common/class/exceptions/HttpException";
import { StatusCode } from "../../../common/constants/statusCode";
import validateEnv from "../../../common/functions/validateEnv";
import { User } from "@prisma/client";
import { ErrorCode } from "../../../common/constants/errorCode";
import { ErrorMessage } from "../../../common/constants/errorMessage";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import ClientException from "../../../common/class/exceptions/ClientException";
import { Request, Response } from "express";
import { Cookie } from "../../../common/constants/Cookie";
import AuthenticationException from "../../../common/class/exceptions/AuthenticationException";

export interface IUserService {
  createUser: (dto: CreateUserDto) => Promise<UserModel>;
  getPublicUserById: (userId: number) => Promise<UserModel | null>;
  getMe: (userId: number) => Promise<Me>;
  updateUser: (
    userId: number,
    userDetails: Partial<User>,
  ) => Promise<UserModel>;
  updateUserPassword: (userId: number, password: string) => Promise<UserModel>;
  deleteUser: (userId: number) => Promise<UserModel>;
  signInUser: (
    req: Request,
    res: Response,
    dto: {
      email: string;
      password: string;
    },
  ) => Promise<UserModel>;
  signOutUser: (req: Request, res: Response) => Promise<void>;
}

@injectable()
export class UserService implements IUserService {
  @inject(UserDITypes.REPOSITORY)
  private repository: IUserRepository;

  public async createUser(dto: CreateUserDto): Promise<UserModel> {
    const { email, password } = dto;
    const existingUser = await this.repository.getUserByEmail(email);
    if (existingUser) {
      throw new HttpException(
        StatusCode.BAD_REQUEST,
        ErrorCode.BAD_REQUEST,
        (
          ErrorMessage[ErrorCode.UNIQUE_CONSTRAINT] as (
            field?: string,
          ) => string
        )("email"),
        true,
      );
    }

    const accessToken = this.generateFreshAuthenticationToken(
      Cookie.ACCESS_TOKEN,
      email,
    );
    const refreshToken = this.generateFreshAuthenticationToken(
      Cookie.REFRESH_TOKEN,
      email,
    );
    dto.password = sha256Encrypt(password);
    const newUser = await this.repository.createUser(dto, accessToken, [
      refreshToken,
    ]);

    return newUser;
  }

  public async getPublicUserById(userId: number): Promise<UserModel | null> {
    const user = await this.repository.getUserById(userId);

    if (!user) {
      return user;
    }

    user.password = "";

    return user;
  }

  public async getMe(userId: number) {
    const me = await this.repository.getMe(userId);

    me.password = "";

    return me;
  }

  public async updateUser(
    userId: number,
    userDetails: Partial<User>,
  ): Promise<UserModel> {
    const updatedUser = await this.repository.updateUser(userId, userDetails);

    return updatedUser;
  }

  public async updateUserPassword(
    userId: number,
    password: string,
  ): Promise<UserModel> {
    const updatedUser = await this.repository.updateUserPassword(
      userId,
      password,
    );

    return updatedUser;
  }

  public async deleteUser(userId: number): Promise<UserModel> {
    const deletedUser = await this.repository.deleteUser(userId);

    return deletedUser;
  }

  async signInUser(
    req: Request,
    res: Response,
    dto: { email: string; password: string },
  ): Promise<UserModel> {
    const { email, password } = dto;
    const userRelatedToSignInEmail =
      await this.repository.getUserByEmail(email);
    if (!userRelatedToSignInEmail) {
      throw new RecordNotFoundException();
    }

    const isPasswordMatch = this.verifyPassword(
      password,
      userRelatedToSignInEmail.password,
    );
    if (!isPasswordMatch) {
      throw new ClientException("Invalid password!");
    }

    const cookies = req.cookies;
    const accessToken = this.generateFreshAuthenticationToken(
      Cookie.ACCESS_TOKEN,
      email,
    );
    const newRefreshToken = this.generateFreshAuthenticationToken(
      Cookie.REFRESH_TOKEN,
      email,
    );

    const storedRefreshToken = cookies[Cookie.REFRESH_TOKEN] as
      | string
      | undefined;

    let newRefreshTokenArray = userRelatedToSignInEmail.refreshToken;
    if (storedRefreshToken) {
      /**
       *
       * Some possible scenarios:
       *
       * 1. User logged in before but never uses refreshToken and doesn't signOut
       * 2. refreshToken is stolen
       *
       * If that's the case, then clear all refreshTokens when user signs in (reuse detection).
       *
       */

      /**
       * Why ? ? ?
       *
       */
      const userBelongToStoredRefreshToken =
        await this.repository.getUserByRefreshToken(storedRefreshToken);

      console.log(userBelongToStoredRefreshToken);

      if (!userBelongToStoredRefreshToken) {
        newRefreshTokenArray = [];
      } else {
        newRefreshTokenArray = newRefreshTokenArray.filter(
          (rt) => rt !== storedRefreshToken,
        );
      }

      res.clearCookie(Cookie.REFRESH_TOKEN, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }

    await this.repository.updateUser(userRelatedToSignInEmail.id, {
      accessToken,
      refreshToken: newRefreshTokenArray,
    });

    const user = {
      ...userRelatedToSignInEmail,
      accessToken,
      newRefreshTokenArray,
    };

    res
      .cookie(Cookie.ACCESS_TOKEN, accessToken, {
        httpOnly: false,
        maxAge: 1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR,
        secure: process.env.NODE_ENV === "production",
      })
      .cookie(Cookie.REFRESH_TOKEN, newRefreshToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

    return user;
  }

  public async signOutUser(cookies: any): Promise<void> {
    const storedRefreshToken = cookies[Cookie.REFRESH_TOKEN] as
      | undefined
      | string;
    if (!storedRefreshToken) throw new AuthenticationException();

    const userRelatedToStoredRefreshToken =
      await this.repository.getUserByRefreshToken(storedRefreshToken);
    if (!userRelatedToStoredRefreshToken) {
      throw new AuthenticationException();
    }

    await this.repository.updateUser(userRelatedToStoredRefreshToken.id, {
      refreshToken: userRelatedToStoredRefreshToken?.refreshToken.filter(
        (rt) => rt !== storedRefreshToken,
      ),
    });
  }

  private generateFreshAuthenticationToken(
    type: Cookie.ACCESS_TOKEN | Cookie.REFRESH_TOKEN,
    email: string,
  ): string {
    const env = validateEnv();
    let privateKey = env.ACCESS_TOKEN_PRIVATE_KEY;
    let expiresIn =
      Math.floor(Date.now()) +
      1000 * 60 * 60 * Cookie.ACCESS_TOKEN_EXPIRES_IN_HOUR;
    if (type.toString() === Cookie.REFRESH_TOKEN.toString()) {
      privateKey = env.REFRESH_TOKEN_PRIVATE_KEY;
      expiresIn =
        Math.floor(Date.now()) +
        1000 * 60 * 60 * 24 * Cookie.REFRESH_TOKEN_EXPIRES_IN_DAY;
    }

    return jwt.sign({ email }, privateKey as string, {
      expiresIn,
    });
  }

  private verifyPassword(password: string, encryptedPassword: string): boolean {
    return isEqual(sha256Encrypt(password), encryptedPassword);
  }
}
