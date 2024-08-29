import { inject, injectable } from "inversify";
import { IProductController, IProductService } from "../product.interface";
import { ProductDITypes } from "../product.type";
import { NextFunction, Request, Response } from "express";
import validateJoi from "../../../common/functions/validateJoi";
import { StatusCode } from "../../../common/constants/statusCode";
import getRequestUserOrThrowAuthenticationException from "../../../common/functions/getRequestUserOrThrowAuthenticationException";
import { CreateProductDtoJoi, UpdateProductDtoJoi } from "./product.joi";
import NaNException from "../../../common/class/exceptions/NaNException";

@injectable()
export default class ProductController implements IProductController {
  @inject(ProductDITypes.SERVICE)
  private readonly service: IProductService;

  public async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: CreateProductDtoJoi })(req, res, next);

      const newProduct = await this.service.createProduct(
        getRequestUserOrThrowAuthenticationException(req),
        req.body,
      );

      return res.status(StatusCode.RESOURCE_CREATED).json({
        data: newProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProducts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const products = await this.service.getProducts();

      return res.status(StatusCode.SUCCESS).json({
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getProductById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const product = await this.service.getProductById({
        productId: this.validateProductId(req),
      });

      return res.status(StatusCode.SUCCESS).json({
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  public async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await validateJoi({ body: UpdateProductDtoJoi })(req, res, next);

      const updatedProduct = await this.service.updateProduct(
        getRequestUserOrThrowAuthenticationException(req),
        { productId: this.validateProductId(req) },
        req.body,
      );

      return res.status(StatusCode.SUCCESS).json({
        data: updatedProduct,
      });
    } catch (error) {
      next(error);
    }
  }

  public async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      await this.service.deleteProduct(
        getRequestUserOrThrowAuthenticationException(req),
        { productId: this.validateProductId(req) },
      );

      return res.status(StatusCode.SUCCESS).json({
        data: {},
      });
    } catch (error) {
      next(error);
    }
  }

  private validateProductId(req: Request): number {
    const productId: number = Number(req.params.productId);
    if (isNaN(productId)) {
      throw new NaNException("productId");
    }

    return productId;
  }
}
