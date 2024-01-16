import { PrismaClient } from "@prisma/client";

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
