import {
  IScholarshipAuthorization,
  IScholarshipRepository,
  IScholarshipService,
} from "../scholarship.interface";
import { inject, injectable } from "inversify";
import {
  $ScholarshipAPI,
  ScholarshipDITypes,
  ScholarshipModel,
} from "../scholarship.type";
import { UserModel } from "../../user/user.type";

@injectable()
export default class ScholarshipService implements IScholarshipService {
  @inject(ScholarshipDITypes.REPOSITORY)
  repository: IScholarshipRepository;

  @inject(ScholarshipDITypes.AUTHORIZATION)
  authorization: IScholarshipAuthorization;

  public async createScholarship(
    user: UserModel,
    dto: $ScholarshipAPI.CreateScholarship.Dto,
  ): Promise<ScholarshipModel> {
    await this.authorization.authorizeCreateScholarship(user);

    return this.repository.createScholarship(dto);
  }

  public async getScholarships(): Promise<ScholarshipModel[]> {
    return this.repository.getScholarships();
  }

  public async getScholarshipById(
    scholarshipId: number,
  ): Promise<ScholarshipModel> {
    return this.repository.getScholarshipByIdOrThrow(scholarshipId);
  }

  public async updateScholarship(
    scholarshipId: number,
    user: UserModel,
    dto: $ScholarshipAPI.UpdateScholarship.Dto,
  ): Promise<ScholarshipModel> {
    await this.authorization.authorizeUpdateScholarship(user);

    return this.repository.updateScholarship(scholarshipId, dto);
  }

  public async deleteScholarship(
    scholarshipId: number,
    user: UserModel,
  ): Promise<{}> {
    await this.authorization.authorizeDeleteScholarship(user);

    return this.repository.deleteScholarship(scholarshipId);
  }
}
