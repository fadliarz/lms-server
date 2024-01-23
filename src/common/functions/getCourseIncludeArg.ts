import { CourseEnrollmentRole } from "@prisma/client";
import { GetCourseByIdQuery } from "../../modules/course/course.type";

export default function getCourseIncludeArg(query: GetCourseByIdQuery) {
  const {
    include_author,
    include_category,
    include_playlist,
    include_students,
    include_instructors,
  } = query;

  let enrollmentRole: CourseEnrollmentRole[] = [];
  if (include_students || include_instructors) {
    if (include_students) {
      enrollmentRole.push(CourseEnrollmentRole.STUDENT);
    }

    if (include_instructors) {
      enrollmentRole.push(CourseEnrollmentRole.INSTRUCTOR);
    }
  }

  const courseIncludeArg = {
    author: include_author
      ? {
          select: {
            id: true,
            name: true,
            NIM: true,
            avatar: true,
          },
        }
      : false,
    category: include_category
      ? {
          select: {
            id: true,
            title: true,
          },
        }
      : false,
    enrollments:
      enrollmentRole.length > 0
        ? {
            where: {
              role: {
                in: enrollmentRole,
              },
            },
            select: {
              user: true,
              role: true,
            },
          }
        : false,
    lessons: include_playlist
      ? {
          select: {
            id: true,
            title: true,
          },
        }
      : false,
  };

  return courseIncludeArg;
}
