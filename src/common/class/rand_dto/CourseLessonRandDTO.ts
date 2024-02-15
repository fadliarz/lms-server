import "reflect-metadata";
import RandDBUtil from "../randprisma/RandDBUtil";
import { ICourseLessonRandDTO } from "./rand_dto.type";
import { CreateCourseLessonDto } from "../../../modules/lesson/lesson.type";
import { injectable } from "inversify";

@injectable()
export default class CourseLessonRandDTO
  extends RandDBUtil
  implements ICourseLessonRandDTO
{
  public generateCreateLessonDTO(): CreateCourseLessonDto {
    return {
      title: "someTitle",
    };
  }
}
