import "reflect-metadata";
import RandDBUtil from "../randprisma/RandDBUtil";
import { ICourseLessonVideoRandDTO } from "./rand_dto.type";
import { injectable } from "inversify";
import { CreateCourseLessonVideoDto } from "../../../modules/video/video.type";

@injectable()
export default class CourseLessonVideoRandDTO
  extends RandDBUtil
  implements ICourseLessonVideoRandDTO
{
  public generateCreateLessonVideoDTO(): CreateCourseLessonVideoDto {
    return {
      name: "someName",
      description: "someDescription",
      youtubeLink: "someYoutubeLink",
      totalDurations: this.generateRandomInteger(10, 1000),
    };
  }
}
