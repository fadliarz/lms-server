import Joi from "joi";
import { $CourseScheduleAPI } from "../schedule.api";

export const CreateCourseScheduleDtoJoi =
  Joi.object<$CourseScheduleAPI.CreateSchedule.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    date: Joi.date().required(),
  });

export const GetCourseSchedulesQuery =
  Joi.object<$CourseScheduleAPI.GetSchedules.Query>({
    pageSize: Joi.number(),
    pageNumber: Joi.number(),
  });

export const UpdateCourseScheduleDtoJoi =
  Joi.object<$CourseScheduleAPI.CreateSchedule.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    date: Joi.date(),
  });
