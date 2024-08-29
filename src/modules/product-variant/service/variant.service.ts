import { inject, injectable } from "inversify";
import {
  IProductVariantAuthorization,
  IProductVariantRepository,
  IProductVariantService,
} from "../variant.interface";
import {
  ProductVariantDITypes,
  ProductVariantResourceId,
} from "../variant.type";
import { UserModel } from "../../user/user.type";
import { $ProductVariantAPI } from "../variant.api";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

@injectable()
export default class ProductVariantService implements IProductVariantService {
  @inject(ProductVariantDITypes.REPOSITORY)
  private readonly repository: IProductVariantRepository;

  @inject(ProductVariantDITypes.AUTHORIZATION)
  private readonly authorization: IProductVariantAuthorization;

  public async createVariant(
    user: UserModel,
    id: {
      resourceId: ProductVariantResourceId;
    },
    dto: $ProductVariantAPI.CreateVariant.Dto,
  ): Promise<$ProductVariantAPI.CreateVariant.Response["data"]> {
    try {
      await this.authorization.authorizeCreateVariant(user);

      return await this.repository.createVariant(
        { productId: id.resourceId.productId },
        dto,
      );
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getVariants(id: {
    resourceId: ProductVariantResourceId;
  }): Promise<$ProductVariantAPI.GetVariants.Response["data"]> {
    try {
      return await this.repository.getVariants({
        productId: id.resourceId.productId,
      });
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getVariantById(id: {
    variantId: number;
    resourceId: ProductVariantResourceId;
  }): Promise<$ProductVariantAPI.GetVariantById.Response["data"]> {
    try {
      return await this.repository.getVariantByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateVariant(
    user: UserModel,
    id: {
      variantId: number;
      resourceId: ProductVariantResourceId;
    },
    dto: $ProductVariantAPI.UpdateVariant.Dto,
  ): Promise<$ProductVariantAPI.UpdateVariant.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateVariant(user);

      return await this.repository.updateVariant(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteVariant(
    user: UserModel,
    id: {
      variantId: number;
      resourceId: ProductVariantResourceId;
    },
  ): Promise<$ProductVariantAPI.DeleteVariant.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteVariant(user);

      return await this.repository.deleteVariant(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
