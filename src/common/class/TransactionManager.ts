import { PrismaTransaction } from "../types";
import { PrismaClient } from "@prisma/client";
import PrismaClientSingleton from "./PrismaClientSingleton";

export default class TransactionManager {
  private readonly prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaClientSingleton.getInstance();
  }

  async initializeTransaction<T>(
    callback: (transaction: PrismaTransaction) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  }
}
