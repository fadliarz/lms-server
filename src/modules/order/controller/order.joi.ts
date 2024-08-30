import Joi from "joi";
import { $OrderAPI } from "../order.api";

export const CreateOrderDtoJoi = Joi.object<$OrderAPI.CreateOrder.Dto>({
  userId: Joi.number().required(),
  description: Joi.string(),
});

export const UpdateOrderArrivedStatusDtoJoi =
  Joi.object<$OrderAPI.UpdateOrderArrivedStatus.Dto>({
    isArrived: Joi.boolean().required(),
  });

export const UpdateOrderReceiptDtoJoi =
  Joi.object<$OrderAPI.UpdateOrderReceipt.Dto>({
    receipt: Joi.string().allow(null).required(),
  });

export const UpdateOrderRatingDtoJoi =
  Joi.object<$OrderAPI.UpdateOrderReceipt.Dto>({
    receipt: Joi.number().integer().min(1).max(5).allow(null).required(),
  });
