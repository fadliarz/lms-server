import { Course, Prisma, Role, User } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export const UserDITypes = {
  REPOSITORY: Symbol.for("USER_REPOSITORY"),
  SERVICE: Symbol.for("USER_SERVICE"),
  CONTROLLER: Symbol.for("USER_CONTROLLER"),
};

export enum userUrls {
  root = "/users",
  me = "/me",
  user = "/:userId",
  signUp = "/signup",
  signIn = "/signin",
  logOut = "/logout",
}

/**
 * Model
 */
export type UserModel = User;
export type ValuableUserModel =
  ModifyFieldWithNullToBeOptionalAndRemoveNull<UserModel>;
export type UserRole = Role;
export const UserRole = Role;
export type PublicUserModel = Omit<
  UserModel,
  "accessToken" | "refreshToken" | "password"
>;

/**
 *
 *
 * Dto
 *
 *
 */

/**
 * User
 *
 */
export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
  NIM: string;
  phoneNumber?: string;
  avatar?: string;
  about?: string;
};
export type UpdateBasicUserDto = Partial<
  Omit<CreateUserDto, "email" | "password" | "phoneNumber">
>;
export type SignInDto = Pick<CreateUserDto, "email" | "password">;

/**
 * Profile
 *
 */
export type BasicUserModel = {
  name: string;
  NIM: string;
};
export type UserCourseType = Pick<
  Course,
  | "id"
  | "title"
  | "description"
  | "totalStudents"
  | "totalLikes"
  | "totalLessons"
  | "createdAt"
  | "updatedAt"
>;
export type Me = UserModel & {
  courses: UserCourseType[];
};
export type UserSelect = Pick<Prisma.UserSelect, keyof User>;
