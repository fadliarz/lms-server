import { injectable } from "inversify";
import { IProductVariantRepository } from "../variant.interface";
import BaseRepository from "../../../common/class/BaseRepository";
import { $ProductVariantAPI } from "../variant.api";
import { ProductVariantModel, ProductVariantResourceId } from "../variant.type";
import RecordNotFoundException from "../../../common/class/exceptions/RecordNotFoundException";
import { ProductModel } from "../../product/product.type";

@injectable()
export default class ProductVariantRepository
  extends BaseRepository
  implements IProductVariantRepository
{
  constructor() {
    super();
  }

  public async createVariant(
    id: { productId: number },
    data: {
      productSnapshot: ProductModel;
    } & $ProductVariantAPI.CreateVariant.Dto,
  ): Promise<ProductVariantModel> {
    return this.db.productVariant.create({
      data: {
        ...data,
        productId: id.productId,
      },
    });
  }

  public async getVariants(id: {
    productId: number;
  }): Promise<ProductVariantModel[]> {
    return this.db.productVariant.findMany({
      where: id,
    });
  }

  public async getVariantById(id: {
    variantId: number;
    resourceId?: ProductVariantResourceId;
  }): Promise<ProductVariantModel | null> {
    return this.db.productVariant.findFirst({
      where: this.getWhereObject(id),
    });
  }

  public async getVariantByIdOrThrow(
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    error?: Error,
  ): Promise<ProductVariantModel> {
    const variant = await this.getVariantById(id);

    if (!variant) {
      throw error || new RecordNotFoundException();
    }

    return variant;
  }

  public async updateVariant(
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    data: Partial<Omit<ProductVariantModel, "productSnapshot">> & {
      productSnapshot?: ProductModel;
    },
  ): Promise<ProductVariantModel> {
    return this.db.productVariant.update({
      where: this.getWhereObject(id),
      data,
    });
  }

  public async deleteVariant(id: {
    variantId: number;
    resourceId?: ProductVariantResourceId;
  }): Promise<{ id: number }> {
    return this.db.productVariant.delete({
      where: this.getWhereObject(id),
      select: { id: true },
    });
  }

  public async updateVariantStockWithIncrement(
    id: {
      variantId: number;
      resourceId?: ProductVariantResourceId;
    },
    data: $ProductVariantAPI.UpdateVariantStockWithIncrement.Dto,
  ): Promise<ProductVariantModel> {
    return this.db.productVariant.update({
      where: this.getWhereObject(id),
      data: {
        stock: data,
      },
    });
  }

  private getWhereObject(id: {
    variantId: number;
    resourceId?: ProductVariantResourceId;
  }):
    | { id: number }
    | {
        id: number;
        productId: number;
      } {
    if (id.resourceId) {
      return { id: id.variantId, productId: id.resourceId.productId };
    }

    return { id: id.variantId };
  }
}
