"use strict";
// @ts-ignore
// @ts-ignore
// @ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
const config_1 = require("@snaplet/seed/config");
const adapter_postgres_1 = require("@snaplet/seed/adapter-postgres");
const postgres_1 = __importDefault(require("postgres"));
exports.url = {
    dev: process.env.POSTGRES_URL,
    prod: "postgres://default:30fRXznDjkbI@ep-solitary-firefly-a4f278w7.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
};
exports.default = (0, config_1.defineConfig)({
    adapter: () => {
        const POSTGRES_URL = exports.url.dev;
        if (!POSTGRES_URL) {
            throw new Error("POSTGRES_URL is not defined");
        }
        const client = (0, postgres_1.default)(POSTGRES_URL);
        return new adapter_postgres_1.SeedPostgres(client);
    },
});
