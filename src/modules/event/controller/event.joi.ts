import Joi from "joi";
import { CreateEventDto } from "../event.type";

/**
 * Create
 *
 */
export const CreateEventDtoJoi = Joi.object<CreateEventDto>({
  title: Joi.string().required(),
  description: Joi.string(),
  date: Joi.date().required(),
});

/**
 * Update
 *
 */
export const UpdateEventDtoJoi = Joi.object<CreateEventDto>({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date(),
});
