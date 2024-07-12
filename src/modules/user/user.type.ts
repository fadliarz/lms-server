import { Role, User } from "@prisma/client";

export const UserDITypes = {
  REPOSITORY: Symbol.for("USER_REPOSITORY"),
  SERVICE: Symbol.for("USER_SERVICE"),
  CONTROLLER: Symbol.for("USER_CONTROLLER"),
  AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
};

export enum userUrls {
  root = "/users",
  user = "/:userId",
  me = userUrls.user + "/me",
  public = userUrls.user + "/public",
  basic = userUrls.user + "/basic",
  email = userUrls.user + "/email",
  password = userUrls.user + "/password",
  phoneNumber = userUrls.user + "/phone",
  signIn = "/signin",
  signOut = "/signout",
}

/**
 *
 *
 * Interface
 *
 *
 */

/**
 * Interface Authorization
 *
 */
export interface IUserAuthorization {
  authorizeGetMe: (user: UserModel, targetUserId: number) => void;
  authorizeUpdateUser: (user: UserModel, targetUserId: number) => void;
  authorizeDeleteUser: (user: UserModel, targetUserId: number) => void;
}

/**
 *
 *
 * Model
 *
 *
 */
export type UserModel = User;
export type UserRole = Role;
export const UserRole = Role;
export type PublicUserModel = Pick<
  UserModel,
  "id" | "name" | "NIM" | "avatar" | "about" | "role"
>;
export type FilteredUserModel = Exclude<
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
export type CreateUserDto = {
  email: string;
  password: string;
  name: string;
  NIM: string;
  phoneNumber?: string;
  avatar?: string;
  about?: string;
};

export type UpdateBasicUserDto = {
  name?: string;
  NIM?: string;
  avatar?: string;
  about?: string;
};

export type UpdateUserEmailDto = {
  email: string;
};

export type UpdateUserPasswordDto = {
  password: string;
};

export type UpdateUserPhoneNumberDto = {
  phoneNumber: string;
};

export type SignInDto = Pick<CreateUserDto, "email" | "password">;

/**
 * Profile
 *
 */
export type Me = UserModel;
