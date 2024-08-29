import Joi from "joi";
import { $ProductVariantAPI } from "../variant.api";

export const CreateProductVariantDtoJoi =
  Joi.object<$ProductVariantAPI.CreateVariant.Dto>({
    title: Joi.string().required(),
    price: Joi.number().required(),
  });

export const UpdateProductVariantDtoJoi =
  Joi.object<$ProductVariantAPI.UpdateVariant.Dto>({
    title: Joi.string(),
    price: Joi.number(),
  });
