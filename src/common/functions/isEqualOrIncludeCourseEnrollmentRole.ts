import { CourseEnrollmentRole } from "@prisma/client";

export default function isEqualOrIncludeCourseEnrollmentRole(
  firstRole: CourseEnrollmentRole,
  secondRole: CourseEnrollmentRole | CourseEnrollmentRole[]
) {
  if (Array.isArray(secondRole)) {
    return secondRole
      .map((role) => role.toString())
      .includes(firstRole.toString());
  }

  return firstRole.toString() === secondRole.toString();
}
