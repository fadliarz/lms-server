import { UserModel } from "../../modules/user/user.type";

export default function filterPublicData(user: UserModel): UserModel {
  user.accessToken = "undefined";
  user.refreshToken = [];
  user.password = "undefined";

  return user;
}
