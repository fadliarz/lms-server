import { User } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type UserModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<User>;
export type PublicUser = Omit<UserModel, "password">;
export type UserDateKeys = "createdAt" | "updatedAt";
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
  signUp = "/signup",
  signIn = "/signin",
  logOut = "/logout",
}

/**
 * Dto
 */
export type SignUpDto = Omit<UserModel, ExcludeFromDto>;
export type SignInDto = SignUpDto;

export type BaseUserProfile = {
  name: string;
  NIM: string;
};
