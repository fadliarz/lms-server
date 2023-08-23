import { Role } from "@prisma/client";
import isEqualOrIncludeRole from "./isEqualOrIncludeRole";

export default function getRoleStatus(userRole: Role) {
  const isAdmin = isEqualOrIncludeRole(userRole, Role.OWNER);
  const isInstructor = isEqualOrIncludeRole(userRole, Role.INSTRUCTOR);
  const isStudent = isEqualOrIncludeRole(userRole, Role.STUDENT);

  return {
    isAdmin,
    isInstructor,
    isStudent,
  };
}
