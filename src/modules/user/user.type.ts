import { UserRoleModel } from "../course/course.type";

export const UserDITypes = {
  REPOSITORY: Symbol.for("USER_REPOSITORY"),
  SERVICE: Symbol.for("USER_SERVICE"),
  CONTROLLER: Symbol.for("USER_CONTROLLER"),
  AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
};

export enum userUrls {
  root = "/users",
  user = "/:userId",
  me = "/me",
  public = userUrls.user + "/public",
  basic = userUrls.user + "/basic",
  email = userUrls.user + "/email",
  password = userUrls.user + "/password",
  phoneNumber = userUrls.user + "/phone",
  assignments = userUrls.user + "/assignments",
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
  authorizeGetUserAssignments: (user: UserModel, targetUserId: number) => void;
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
export type UserModel = {
  id: number;
  email: string;
  password: string;
  accessToken: string | null;
  refreshToken: string[];
  phoneNumber: string | null;
  name: string;
  NIM: string;
  avatar: string;
  about: string | null;
  totalCourses: number;
  totalLessons: number;
  totalUnreadMessages: number;
  createdAt: Date;
  updatedAt: Date;
  role: UserRoleModel;
  dateOfBirth: Date;
  address: string;
  bloodType: string;
  medicalHistories: string[];
  HMM: string[];
  UKM: string[];
  hobbies: string[];
  lineId: string;
  emergencyNumber: string;
};

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
  phoneNumber?: string;
  name: string;
  NIM: string;
  avatar?: string;
  about?: string;
  dateOfBirth: Date;
  address: string;
  bloodType: string;
  medicalHistories: string[];
  HMM: string[];
  UKM: string[];
  hobbies: string[];
  lineId: string;
  emergencyNumber: string;
};

export type UpdateBasicUserDto = Omit<
  Partial<CreateUserDto>,
  "email" | "password" | "phoneNumber"
>;

export type UpdateUserEmailDto = {
  email: string;
};

export type UpdateUserPasswordDto = {
  password: string;
};

export type UpdateUserPhoneNumberDto = {
  phoneNumber: string;
};

export type UpdateUserRoleDto = {
  role: UserRoleModel;
};

export type SignInDto = Pick<CreateUserDto, "email" | "password">;

/**
 * Profile
 *
 */
export type Me = UserModel;
