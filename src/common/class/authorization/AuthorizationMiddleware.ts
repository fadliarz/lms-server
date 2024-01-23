import { ITable } from "../table/table.type";
import PrismaTable from "../table/PrismaTable";

export default abstract class AuthorizationMiddleware {
  protected readonly table: ITable = new PrismaTable();
}
