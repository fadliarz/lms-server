import {
  CourseLessonAuthorizationMiddleware,
  ICourseLessonAuthorizationMiddleware,
} from "../../lesson/authorization/lesson.authorization";

export class ICourseLessonVideoAuthorizationMiddleware extends ICourseLessonAuthorizationMiddleware {}

export class CourseLessonVideoAuthorizationMiddleware
  extends CourseLessonAuthorizationMiddleware
  implements ICourseLessonAuthorizationMiddleware {}
