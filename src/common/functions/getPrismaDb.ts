import { PrismaTransaction } from "../types";
import { PrismaClient } from "@prisma/client";
import { AsyncLocalStorage } from "node:async_hooks";
import { LocalStorageKey } from "../constants/LocalStorageKey";
import PrismaClientSingleton from "../class/PrismaClientSingleton";

export default function getPrismaDb(
  asyncLocalStorage: AsyncLocalStorage<any>,
): PrismaTransaction | PrismaClient {
  let db: PrismaTransaction | PrismaClient =
    PrismaClientSingleton.getInstance();
  const store = asyncLocalStorage.getStore();

  if (store) {
    db = (store as any)[LocalStorageKey.TRANSACTION] as PrismaTransaction;
  }

  return db;
}
