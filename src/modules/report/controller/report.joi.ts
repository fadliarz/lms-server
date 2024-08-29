import Joi from "joi";
import { $ReportAPI } from "../report.api";

export const UpdateReportDtoJoi = Joi.object<$ReportAPI.UpdateReport.Dto>({
  points: Joi.number(),
  performance: Joi.number(),
  participation: Joi.number(),
});
