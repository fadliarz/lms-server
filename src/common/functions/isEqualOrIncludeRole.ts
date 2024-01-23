import { UserRoleModel } from "../../modules/course/course.type";

export default function isEqualOrIncludeRole(
  firstRole: UserRoleModel,
  secondRole: UserRoleModel | UserRoleModel[],
) {
  if (Array.isArray(secondRole)) {
    return secondRole
      .map((role) => role.toString())
      .includes(firstRole.toString());
  }

  return firstRole.toString() === secondRole.toString();
}
