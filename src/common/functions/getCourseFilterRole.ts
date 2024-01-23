import { CourseEnrollmentRole } from "@prisma/client";
import { GetEnrolledCoursesQuery } from "../../modules/course/course.type";

export default function getCourseFilter(
  query: GetEnrolledCoursesQuery
): CourseEnrollmentRole[] | undefined {
  const { include_student_courses, include_instructor_courses } = query;
  let enrollmentRole: CourseEnrollmentRole[] = [];

  if (include_student_courses) {
    enrollmentRole.push(CourseEnrollmentRole.STUDENT);
  }
  if (include_instructor_courses) {
    enrollmentRole.push(CourseEnrollmentRole.INSTRUCTOR);
  }

  return enrollmentRole.length > 0 ? enrollmentRole : undefined;
}
