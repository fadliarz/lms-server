import Joi from "joi";
import { $CourseScheduleAPI } from "../schedule.type";

export const CreateCourseScheduleDtoJoi =
  Joi.object<$CourseScheduleAPI.CreateSchedule.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date().required(),
  });

export const UpdateCourseScheduleDtoJoi =
  Joi.object<$CourseScheduleAPI.CreateSchedule.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    date: Joi.date(),
  });
