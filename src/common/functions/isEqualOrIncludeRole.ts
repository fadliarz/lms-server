import { Role } from "@prisma/client";

export default function isEqualOrIncludeRole(
  firstRole: Role,
  secondRole: Role | Role[]
) {
  if (Array.isArray(secondRole)) {
    return secondRole
      .map((role) => role.toString())
      .includes(firstRole.toString());
  }

  return firstRole.toString() === secondRole.toString();
}
