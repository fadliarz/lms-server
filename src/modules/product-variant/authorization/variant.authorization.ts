import { inject, injectable } from "inversify";
import BaseAuthorization from "../../../common/class/BaseAuthorization";
import { IProductVariantAuthorization } from "../variant.interface";
import { UserModel } from "../../user/user.type";
import { IProductAuthorization } from "../../product/product.interface";
import { ProductDITypes } from "../../product/product.type";

@injectable()
export default class ProductVariantAuthorization
  extends BaseAuthorization
  implements IProductVariantAuthorization
{
  @inject(ProductDITypes.AUTHORIZATION)
  private readonly productAuthorization: IProductAuthorization;

  public async authorizeCreateVariant(user: UserModel): Promise<void> {
    await this.productAuthorization.authorizeCreateProduct(user);
  }

  public async authorizeUpdateVariant(user: UserModel): Promise<void> {
    await this.authorizeCreateVariant(user);
  }

  public async authorizeDeleteVariant(user: UserModel): Promise<void> {
    await this.authorizeCreateVariant(user);
  }
}
