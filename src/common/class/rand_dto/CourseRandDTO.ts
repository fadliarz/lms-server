import "reflect-metadata";
import RandDBUtil from "../randprisma/RandDBUtil";
import { ICourseRandDTO } from "./rand_dto.type";
import { CreateCourseDto } from "../../../modules/course/course.type";
import { injectable } from "inversify";

@injectable()
export default class CourseRandDTO
  extends RandDBUtil
  implements ICourseRandDTO
{
  public generateCreateCourseDTO(categoryId: number): CreateCourseDto {
    return {
      title: this.generateRandomString(8),
      categoryId,
    };
  }
}
