import Joi from "joi";
import { $EventAPI } from "../event.api";

export const CreateEventDtoJoi = Joi.object<$EventAPI.CreateEvent.Dto>({
  title: Joi.string().required(),
  description: Joi.string(),
  date: Joi.date().required(),
});

export const UpdateEventDtoJoi = Joi.object<$EventAPI.UpdateEvent.Dto>({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date(),
});
