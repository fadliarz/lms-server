import { UserRoleModel } from "../../modules/course/course.type";

export default function getUserRoleArray(): UserRoleModel[] {
  const roles: UserRoleModel[] = [];
  for (const roleKey of Object.keys(UserRoleModel)) {
    roles.push(UserRoleModel[roleKey as keyof typeof UserRoleModel]);
  }

  return roles;
}
