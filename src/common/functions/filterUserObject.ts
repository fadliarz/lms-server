import { FilteredUserModel, UserModel } from "../../modules/user/user.type";
import getValuable from "./removeNullFields";

export default function filterUserObject(user: UserModel): FilteredUserModel {
  user.password = null as any;
  user.accessToken = null as any;
  user.refreshToken = null as any;

  return getValuable(user);
}
