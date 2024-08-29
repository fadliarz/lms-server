import { inject, injectable } from "inversify";
import {
  IProductVariantController,
  IProductVariantService,
} from "../variant.interface";
import {
  ProductVariantDITypes,
  ProductVariantResourceId,
} from "../variant.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { StatusCode } from "../../../common/constants/statusCode";
import {
  CreateProductVariantDtoJoi,
  UpdateProductVariantDtoJoi,
} from "./variant.joi";
import NaNException from "../../../common/class/exceptions/NaNException";

@injectable()
export default class ProductVariantController
  implements IProductVariantController
{
  @inject(ProductVariantDITypes.SERVICE)
  private readonly service: IProductVariantService;

  public async createVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateProductVariantDtoJoi })(req, res, next);

      const newVariant = await this.service.createVariant(
        getRequestUserOrThrowAuthenticationException(req),
        { resourceId: this.validateResourceId(req) },
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newVariant,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getVariants(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const variants = await this.service.getVariants({
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: variants,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getVariantById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const variant = await this.service.getVariantById({
        variantId: this.validateVariantId(req),
        resourceId: this.validateResourceId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: variant,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateProductVariantDtoJoi })(req, res, next);

      const updatedVariant = await this.service.updateVariant(
        getRequestUserOrThrowAuthenticationException(req),
        {
          variantId: this.validateVariantId(req),
          resourceId: this.validateResourceId(req),
        },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedVariant,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteVariant(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteVariant(
        getRequestUserOrThrowAuthenticationException(req),
        {
          variantId: this.validateVariantId(req),
          resourceId: this.validateResourceId(req),
        },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  private validateVariantId(req: Request): number {
    const variantId: number = Number(req.params.variantId);
    if (isNaN(variantId)) {
      throw new NaNException("variantId");
    }

    return variantId;
  }

  private validateResourceId(req: Request): ProductVariantResourceId {
    const productId: number = Number(req.params.productId);
    if (isNaN(productId)) {
      throw new NaNException("productId");
    }

    return {
      productId,
    };
  }
}
