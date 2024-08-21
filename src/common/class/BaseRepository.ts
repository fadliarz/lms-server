import getPrismaDb from "../functions/getPrismaDb";
import asyncLocalStorage from "../asyncLocalStorage";
import { PrismaTransaction } from "../types";
import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export default class BaseRepository {
  protected db: PrismaTransaction | PrismaClient;

  constructor() {
    this.wrapMethods();
  }

  protected wrapMethods() {
    const methodNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    ).filter(
      (name) =>
        name !== "constructor" && typeof (this as any)[name] === "function",
    );

    methodNames.forEach((methodName) => {
      const originalMethod = (this as any)[methodName];
      (this as any)[methodName] = (...args: any[]) => {
        this.db = getPrismaDb(asyncLocalStorage);
        return originalMethod.apply(this, args);
      };
    });
  }
}
