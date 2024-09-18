import { injectable } from "inversify";
import { IProductRepository } from "../product.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $ProductAPI } from "../product.api";
import { ProductModel } from "../product.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";

@injectable()
export default class ProductRepository
  extends BaseRepository
  implements IProductRepository
{
  constructor() {
    super();
  }

  public async createProduct(
    data: $ProductAPI.CreateProduct.Dto,
  ): Promise<ProductModel> {
    return this.db.product.create({
      data,
    });
  }

  public async getProducts(): Promise<ProductModel[]> {
    return this.db.product.findMany();
  }

  public async getProductById(id: {
    productId: number;
  }): Promise<$ProductAPI.GetProductById.Response["data"] | null> {
    return this.db.product.findUnique({
      where: { id: id.productId },
      include: { variants: true },
    });
  }

  public async getProductByIdOrThrow(
    id: {
      productId: number;
    },
    error?: Error,
  ): Promise<$ProductAPI.GetProductById.Response["data"]> {
    const product = await this.getProductById(id);

    if (!product) {
      throw error || new RecordNotFoundException();
    }

    return product;
  }

  public async updateProduct(
    id: {
      productId: number;
    },
    data: Partial<ProductModel>,
  ): Promise<ProductModel> {
    return this.db.product.update({ where: { id: id.productId }, data });
  }

  public async deleteProduct(id: {
    productId: number;
  }): Promise<{ id: number }> {
    return this.db.product.delete({
      where: { id: id.productId },
      select: { id: true },
    });
  }
}
