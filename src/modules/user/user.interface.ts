import {
  $UserReturnData,
  CreateUserDto,
  Me,
  PublicUserModel,
  UpdateBasicUserDto,
  UpdateUserEmailDto,
  UpdateUserPasswordDto,
  UpdateUserPhoneNumberDto,
  UpdateUserRoleDto,
  UserModel,
} from "./user.type";
import { NextFunction, Request, Response } from "express";
import { Cookie } from "../../common/constants/Cookie";

export interface IUserAuthorization {
  authorizeGetUserAssignments: (user: UserModel, targetUserId: number) => void;
  authorizeUpdateUser: (user: UserModel, targetUserId: number) => void;
  authorizeDeleteUser: (user: UserModel, targetUserId: number) => void;
}

export interface IUserController {
  createUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getPublicUserById: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getMe: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  getUserAssignments: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateBasicUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserEmail: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserPassword: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  updateUserPhoneNumber: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  deleteUser: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signIn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
  signOut: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<Response | void>;
}

export interface IUserService {
  createUser: (dto: CreateUserDto) => Promise<UserModel>;
  getPublicUserById: (userId: number) => Promise<PublicUserModel>;
  getMe: (userId: number) => Promise<Me>;
  getUserAssignments: (
    userId: number,
    targetUserId: number,
  ) => Promise<$UserReturnData.GetUserAssignments>;
  updateBasicUser: (
    userId: number,
    targetUserId: number,
    dto: UpdateBasicUserDto,
  ) => Promise<UserModel>;
  updateUserEmail: (
    userId: number,
    targetUserId: number,
    storedRefreshToken: string,
    dto: UpdateUserEmailDto,
  ) => Promise<UserModel>;
  updateUserPassword: (
    userId: number,
    targetUserId: number,
    storedRefreshToken: string,
    dto: UpdateUserPasswordDto,
  ) => Promise<UserModel>;
  updateUserRole: (
    userId: number,
    targetUserId: number,
    dto: UpdateUserRoleDto,
  ) => Promise<UserModel>;
  updateUserPhoneNumber: (
    userId: number,
    targetUserId: number,
    dto: UpdateUserPhoneNumberDto,
  ) => Promise<UserModel>;
  deleteUser: (userId: number, targetUserId: number) => Promise<{}>;
  signInUser: (
    req: Request,
    res: Response,
    dto: {
      email: string;
      password: string;
    },
  ) => Promise<UserModel>;
  signOutUser: (storedRefreshToken: string) => Promise<void>;
  generateFreshAuthenticationToken: (
    type: Cookie.ACCESS_TOKEN | Cookie.REFRESH_TOKEN,
    email: string,
  ) => string;
}

export interface IUserRepository {
  createUser: (
    dto: CreateUserDto,
    accessToken: string,
    refreshToken: string[],
  ) => Promise<UserModel>;
  getUserById: (userId: number) => Promise<UserModel | null>;
  getUserByIdOrThrow: (userId: number, error?: Error) => Promise<UserModel>;
  getUserByEmail: (email: string) => Promise<UserModel | null>;
  getUserByAccessToken: (accessToken: string) => Promise<UserModel | null>;
  getUserByRefreshToken: (refreshToken: string) => Promise<UserModel | null>;
  getUserAssignments: (
    userId: number,
  ) => Promise<$UserReturnData.GetUserAssignments>;
  updateUser: (userId: number, dto: Partial<UserModel>) => Promise<UserModel>;
  deleteUser: (userId: number) => Promise<UserModel>;
}
