import { IScholarshipAuthorization } from "../scholarship.interface";
import { inject, injectable } from "inversify";
import {
  IRepository,
  RepositoryDITypes,
} from "../../../common/class/repository/repository.type";
import { PrivilegeModel, UserModel } from "../../user/user.type";
import getRoleStatus from "../../../common/functions/getRoleStatus";
import AuthorizationException from "../../../common/class/exceptions/AuthorizationException";

@injectable()
export default class ScholarshipAuthorization
  implements IScholarshipAuthorization
{
  @inject(RepositoryDITypes.FACADE)
  private readonly globalRepository: IRepository;

  public async authorizeCreateScholarship(user: UserModel): Promise<void> {
    const { id: userId, role } = user;
    const { isStudent, isInstructor, isAdmin } = getRoleStatus(role);

    let isAuthorized = false;
    if (isStudent || isInstructor) {
      isAuthorized =
        await this.globalRepository.user.getUserAuthorizationStatusFromPrivilege(
          { userId },
          PrivilegeModel.SCHOLARSHIP,
        );
    }

    if (isAdmin) {
      isAuthorized = true;
    }

    if (!isAuthorized) {
      throw new AuthorizationException();
    }
  }

  public async authorizeUpdateScholarship(user: UserModel): Promise<void> {
    await this.authorizeCreateScholarship(user);
  }

  public async authorizeDeleteScholarship(user: UserModel): Promise<void> {
    await this.authorizeCreateScholarship(user);
  }
}
