import Joi from "joi";
import { $CourseLessonVideoAPI } from "../video.type";

export const CreateCourseLessonVideoDtoJoi =
  Joi.object<$CourseLessonVideoAPI.CreateVideo.Dto>({
    name: Joi.string().required(),
    description: Joi.string(),
    totalDurations: Joi.number().required(),
    youtubeLink: Joi.string().required(),
  });

export const UpdateCourseLessonVideoDtoJoi =
  Joi.object<$CourseLessonVideoAPI.UpdateVideo.Dto>({
    name: Joi.string(),
    description: Joi.string(),
  });

export const UpdateCourseLessonVideoSourceDtoJoi =
  Joi.object<$CourseLessonVideoAPI.UpdateVideoSource.Dto>({
    youtubeLink: Joi.string().required(),
    totalDurations: Joi.number().required(),
  });
