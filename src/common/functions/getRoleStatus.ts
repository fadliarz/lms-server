import isEqualOrIncludeRole from "./isEqualOrIncludeRole";
import { UserRoleModel } from "../../modules/course/course.type";

export default function getRoleStatus(userRole: UserRoleModel) {
  const isAdmin = isEqualOrIncludeRole(userRole, UserRoleModel.ADMIN);
  const isStudent = isEqualOrIncludeRole(userRole, UserRoleModel.STUDENT);

  return {
    isAdmin,
    isStudent,
  };
}
