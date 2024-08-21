import TransactionManager from "./TransactionManager";
import { injectable } from "inversify";

@injectable()
export default class BaseService {
  protected readonly transactionManager = new TransactionManager();
}
