import { PrismaClient } from "@prisma/client";

export default class PrismaClientSingleton {
  private static instance: PrismaClient;

  public constructor() {}

  public static getInstance(): PrismaClient {
    if (!PrismaClientSingleton.instance) {
      PrismaClientSingleton.instance = new PrismaClient({
        log: [
          {
            emit: "event",
            level: "query",
          },
          {
            emit: "stdout",
            level: "error",
          },
          {
            emit: "stdout",
            level: "info",
          },
          {
            emit: "stdout",
            level: "warn",
          },
        ],
      });
    }

    return PrismaClientSingleton.instance;
  }
}
