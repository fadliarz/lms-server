import { inject, injectable } from "inversify";
import { OrderDITypes, OrderResourceId } from "../order.type";
import { IOrderController, IOrderService } from "../order.interface";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { StatusCode } from "../../../common/constants/statusCode";
import { CreateOrderDtoJoi, UpdateOrderArrivedStatusDtoJoi } from "./order.joi";
import NaNException from "../../../common/class/exceptions/NaNException";

@injectable()
export default class OrderController implements IOrderController {
  @inject(OrderDITypes.SERVICE)
  private readonly service: IOrderService;

  public async createOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateOrderDtoJoi })(req, res, next);

      const newOrder = await this.service.createOrder(
        getRequestUserOrThrowAuthenticationException(req),
        this.validateResourceId(req, true),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOrders(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const orders = await this.service.getOrders(
        getRequestUserOrThrowAuthenticationException(req),
        this.validateResourceId(req, true),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getOrderById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const order = await this.service.getOrderById(
        getRequestUserOrThrowAuthenticationException(req),
        this.validateResourceId(req),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateOrderArrivedStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateOrderArrivedStatusDtoJoi })(
        req,
        res,
        next,
      );

      const updatedOrder = await this.service.updateOrderArrivedStatus(
        getRequestUserOrThrowAuthenticationException(req),
        this.validateResourceId(req),
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedOrder,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteOrder(
        getRequestUserOrThrowAuthenticationException(req),
        this.validateResourceId(req),
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  private validateResourceId(
    req: Request,
    exclude: true,
  ): {
    variantId: number;
    resourceId: Omit<OrderResourceId, "variantId">;
  };
  private validateResourceId(
    req: Request,
    exclude?: undefined | false,
  ): { orderId: number; resourceId: OrderResourceId };
  private validateResourceId(
    req: Request,
    exclude?: boolean,
  ):
    | {
        variantId: number;
        resourceId: Omit<OrderResourceId, "variantId">;
      }
    | { orderId: number; resourceId: OrderResourceId } {
    const productId: number = Number(req.params.productId);
    const variantId: number = Number(req.params.variantId);
    if (isNaN(productId)) {
      throw new NaNException("productId || variantId");
    }

    if (!!exclude) {
      return { variantId, resourceId: { productId } };
    }

    const orderId: number = Number(req.params.orderId);
    if (isNaN(orderId)) {
      throw new NaNException("orderId");
    }

    return {
      orderId,
      resourceId: {
        productId,
        variantId,
      },
    };
  }
}
