import { inject, injectable } from "inversify";
import {
  IProductAuthorization,
  IProductRepository,
  IProductService,
} from "../product.interface";
import { ProductDITypes } from "../product.type";
import { UserModel } from "../../user/user.type";
import { $ProductAPI } from "../product.api";
import handleRepositoryError from "../../../common/functions/handleRepositoryError";

@injectable()
export default class ProductService implements IProductService {
  @inject(ProductDITypes.REPOSITORY)
  private readonly repository: IProductRepository;

  @inject(ProductDITypes.AUTHORIZATION)
  private readonly authorization: IProductAuthorization;

  public async createProduct(
    user: UserModel,
    dto: $ProductAPI.CreateProduct.Dto,
  ): Promise<$ProductAPI.CreateProduct.Response["data"]> {
    try {
      await this.authorization.authorizeCreateProduct(user);

      return await this.repository.createProduct(dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getProducts(): Promise<
    $ProductAPI.GetProducts.Response["data"]
  > {
    try {
      return await this.repository.getProducts();
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async getProductById(id: {
    productId: number;
  }): Promise<$ProductAPI.GetProductById.Response["data"]> {
    try {
      return await this.repository.getProductByIdOrThrow(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async updateProduct(
    user: UserModel,
    id: {
      productId: number;
    },
    dto: $ProductAPI.UpdateProduct.Dto,
  ): Promise<$ProductAPI.UpdateProduct.Response["data"]> {
    try {
      await this.authorization.authorizeUpdateProduct(user);

      return await this.repository.updateProduct(id, dto);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }

  public async deleteProduct(
    user: UserModel,
    id: {
      productId: number;
    },
  ): Promise<$ProductAPI.DeleteProduct.Response["data"]> {
    try {
      await this.authorization.authorizeDeleteProduct(user);

      return await this.repository.deleteProduct(id);
    } catch (error: any) {
      throw handleRepositoryError(error);
    }
  }
}
