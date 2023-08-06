import { Role } from "@prisma/client";
import { AuthorizationException } from "../exceptions/AuthorizationException";

export function doMinimumRoleAuthorization(
  userRole: Role,
  minimumRole: Role
): void {
  const roles = [
    Role.STUDENT.toString(),
    Role.INSTRUCTOR.toString(),
    Role.OWNER.toString(),
  ];

  const userRoleLevel = roles.indexOf(userRole.toString());
  const minimumRoleLevel = roles.indexOf(minimumRole.toString());

  if (userRoleLevel < minimumRoleLevel) {
    throw new AuthorizationException();
  }
}
