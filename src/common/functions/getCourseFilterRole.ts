import { Role } from "@prisma/client";
import { GetEnrolledCoursesQuery } from "../../modules/course/course.type";

export default function getCourseFilter(
  query: GetEnrolledCoursesQuery
): Role[] | undefined {
  const { include_student_courses, include_instructor_courses } = query;
  let role: Role[] = [];

  if (include_student_courses) {
    role.push(Role.STUDENT);
  }
  if (include_instructor_courses) {
    role.push(Role.INSTRUCTOR);
  }

  return role.length > 0 ? role : undefined;
}
