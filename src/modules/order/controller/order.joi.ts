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
