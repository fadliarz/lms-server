"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const LocalStorageKey_1 = require("../constants/LocalStorageKey");
const PrismaClientSingleton_1 = __importDefault(require("../class/PrismaClientSingleton"));
function getPrismaDb(asyncLocalStorage) {
    let db = PrismaClientSingleton_1.default.getInstance();
    const store = asyncLocalStorage.getStore();
    if (store) {
        db = store[LocalStorageKey_1.LocalStorageKey.TRANSACTION];
    }
    return db;
}
exports.default = getPrismaDb;
