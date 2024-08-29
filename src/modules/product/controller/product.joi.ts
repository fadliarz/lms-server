import Joi from "joi";
import { $ProductAPI } from "../product.api";

export const CreateProductDtoJoi = Joi.object<$ProductAPI.CreateProduct.Dto>({
  title: Joi.string().required(),
  description: Joi.string(),
});

export const UpdateProductDtoJoi = Joi.object<$ProductAPI.UpdateProduct.Dto>({
  title: Joi.string(),
  description: Joi.string(),
});
