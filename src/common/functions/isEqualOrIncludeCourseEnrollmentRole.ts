import { CourseEnrollmentRoleModel } from "../../modules/course/course.type";

export default function isEqualOrIncludeCourseEnrollmentRole(
  firstRole: CourseEnrollmentRoleModel,
  secondRole: CourseEnrollmentRoleModel | CourseEnrollmentRoleModel[],
) {
  if (Array.isArray(secondRole)) {
    return secondRole
      .map((role) => role.toString())
      .includes(firstRole.toString());
  }

  return firstRole.toString() === secondRole.toString();
}
