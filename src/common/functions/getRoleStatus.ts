import isEqualOrIncludeRole from "./isEqualOrIncludeRole";
import { UserRoleModel } from "../../modules/course/course.type";

export default function getRoleStatus(userRole: UserRoleModel) {
  const isAdmin = isEqualOrIncludeRole(userRole, UserRoleModel.OWNER);
  const isInstructor = isEqualOrIncludeRole(userRole, UserRoleModel.INSTRUCTOR);
  const isStudent = isEqualOrIncludeRole(userRole, UserRoleModel.STUDENT);

  return {
    isAdmin,
    isInstructor,
    isStudent,
  };
}
