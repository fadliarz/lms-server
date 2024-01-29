import "reflect-metadata";
import PrismaClientSingleton from "../PrismaClientSingleton";
import { inject, injectable } from "inversify";
import {
  ICoursePrismaPromise,
  IPrismaPromise,
  PrismaPromiseDITypes,
} from "./prisma_promise.type";

@injectable()
export default class PrismaPromise implements IPrismaPromise {
  @inject(PrismaPromiseDITypes.COURSE)
  public readonly course: ICoursePrismaPromise;
}
