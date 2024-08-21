import Joi from "joi";
import { $CompetitionAPI } from "../competition.type";

export const CreateCompetitionDtoJoi =
  Joi.object<$CompetitionAPI.CreateCompetition.Dto>({
    title: Joi.string().required(),
    description: Joi.string(),
    organizer: Joi.string().required(),
    deadline: Joi.date().required(),
    reference: Joi.string().required(),
  });

export const UpdateCompetitionDtoJoi =
  Joi.object<$CompetitionAPI.UpdateCompetition.Dto>({
    title: Joi.string(),
    description: Joi.string(),
    organizer: Joi.string(),
    deadline: Joi.date(),
    reference: Joi.string(),
  });
