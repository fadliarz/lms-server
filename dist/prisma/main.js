"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const seed_1 = __importDefault(require("./seed"));
const prisma = new client_1.PrismaClient();
(0, seed_1.default)()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Successfully seeding database...");
    yield prisma.$disconnect;
}))
    .catch((error) => __awaiter(void 0, void 0, void 0, function* () {
    console.error("Error seeding database: ", error);
    process.exit(1);
}))
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect;
}));
