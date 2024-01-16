import { PublicUserModel, UserModel } from "../../modules/user/user.type";

export default function filterPublicData(user: UserModel): UserModel {
  user.accessToken = "undefined";
  user.refreshToken = "undefined";
  user.password = "undefined";

  return user;
}
