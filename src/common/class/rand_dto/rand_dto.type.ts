import { CreateUserDto } from "../../../modules/user/user.type";
import { CreateCourseDto } from "../../../modules/course/course.type";
import { CreateCourseLessonDto } from "../../../modules/lesson/lesson.type";
import { CreateCourseLessonVideoDto } from "../../../modules/video/video.type";

export const RandDTODITypes = {
  FACADE: Symbol.for("FACADE_RAND_DTO"),
  USER: Symbol.for("USER_RAND_DTO"),
  COURSE: Symbol.for("COURSE_RAND_DTO"),
  COURSE_LESSON: Symbol.for("COURSE_LESSON_RAND_DTO"),
  COURSE_LESSON_VIDEO: Symbol.for("COURSE_LESSON_VIDEO-RAND_DTO"),
};

export class IRandDTO {
  user: IUserRandDTO;
  course: ICourseRandDTO;
  courseLesson: ICourseLessonRandDTO;
  courseLessonVideo: ICourseLessonVideoRandDTO;
}

export class IUserRandDTO {
  generateCreateUserDTO: () => CreateUserDto;
}

export class ICourseRandDTO {
  generateCreateCourseDTO: (categoryId: number) => CreateCourseDto;
}

export class ICourseLessonRandDTO {
  generateCreateLessonDTO: () => CreateCourseLessonDto;
}

export class ICourseLessonVideoRandDTO {
  generateCreateLessonVideoDTO: () => CreateCourseLessonVideoDto;
}
