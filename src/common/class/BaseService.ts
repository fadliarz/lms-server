import TransactionManager from "./TransactionManager";
import { inject, injectable } from "inversify";
import { IRepository, RepositoryDITypes } from "./repository/repository.type";

@injectable()
export default class BaseService {
  @inject(RepositoryDITypes.FACADE)
  protected readonly globalRepository: IRepository;

  protected readonly transactionManager = new TransactionManager();
}
