import "reflect-metadata";
import {
  ICourseLessonRandDTO,
  ICourseLessonVideoRandDTO,
  ICourseRandDTO,
  IRandDTO,
  IUserRandDTO,
  RandDTODITypes,
} from "./rand_dto.type";
import { inject, injectable } from "inversify";

@injectable()
export default class RandDTO implements IRandDTO {
  @inject(RandDTODITypes.USER)
  public readonly user: IUserRandDTO;

  @inject(RandDTODITypes.COURSE)
  public readonly course: ICourseRandDTO;

  @inject(RandDTODITypes.COURSE_LESSON)
  public readonly courseLesson: ICourseLessonRandDTO;

  @inject(RandDTODITypes.COURSE_LESSON_VIDEO)
  public readonly courseLessonVideo: ICourseLessonVideoRandDTO;
}
