import Joi from "joi";
import { $CourseLessonVideoAPI } from "../video.api";

export const CreateCourseLessonVideoDtoJoi =
  Joi.object<$CourseLessonVideoAPI.CreateVideo.Dto>({
    name: Joi.string().required(),
    description: Joi.string(),
    totalDurations: Joi.number().required(),
    youtubeLink: Joi.string().required(),
  });

export const GetCourseLessonVideosQueryJoi =
  Joi.object<$CourseLessonVideoAPI.GetVideos.Query>({
    pageNumber: Joi.number(),
    pageSize: Joi.number(),
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
