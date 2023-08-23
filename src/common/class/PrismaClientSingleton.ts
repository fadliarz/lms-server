import { PrismaClient } from "@prisma/client";
import { injectable } from "inversify";

@injectable()
export default class PrismaClientSingleton {
  private static instance: PrismaClient;

  public constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient();
    }

    return PrismaClientSingleton.instance;
  }
}
