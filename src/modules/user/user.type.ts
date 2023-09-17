import { Course, Prisma, User } from "@prisma/client";
import {
  MakePropertiesOptional,
  ModifyFieldWithNullToBeOptionalAndRemoveNull,
} from "../../common/types";

export type UserModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<User>;
export type PublicUser = Omit<UserModel, "password">;

export type UserDateKeys = "createdAt" | "updatedAt";
export type UserHasDefaultValue =
  | "avatar"
  | "totalLessons"
  | "totalCourses"
  | "totalUnreadMessages";
export type ExcludeFromDto =
  | "id"
  | "role"
  | "accessToken"
  | "refreshToken"
  | UserDateKeys;

export const UserDITypes = {
  USER_REPOSITORY: Symbol.for("USER_REPOSITORY"),
  USER_SERVICE: Symbol.for("USER_SERVICE"),
  USER_CONTROLLER: Symbol.for("USER_CONTROLLER"),
};

export enum userUrls {
  root = "/auth",
  me = "/me",
  signUp = "/signup",
  signIn = "/signin",
  logOut = "/logout",
}

/**
 * Dto
 */
export type SignUpDto = MakePropertiesOptional<
  Omit<UserModel, ExcludeFromDto>,
  UserHasDefaultValue
>;
export type SignInDto = Pick<SignUpDto, "email" | "password">;

export type BaseUserProfile = {
  name: string;
  NIM: string;
};
export type UserSelect = Pick<Prisma.UserSelect, keyof User>;
export type Me = UserModel & {
  courses: UserCourseType[];
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
