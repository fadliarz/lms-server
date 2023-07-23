import { User } from "@prisma/client";
import { ModifyFieldWithNullToBeOptionalAndRemoveNull } from "../../common/types";

export type UserModel = ModifyFieldWithNullToBeOptionalAndRemoveNull<User>;
export type UserDateKeys = "createdAt" | "updatedAt";
export type PublicUser = Omit<UserModel, "password">;

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
export type SignUpDto = Omit<
  UserModel,
  "id" | "role" | "accessToken" | "refreshToken" | UserDateKeys
>;
export type SignInDto = SignUpDto;
