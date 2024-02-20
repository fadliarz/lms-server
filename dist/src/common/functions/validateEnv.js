"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
function validateEnv() {
    const env = (0, envalid_1.cleanEnv)(process.env, {
        NODE_ENV: (0, envalid_1.str)({
            choices: ["development", "production", "test"],
        }),
        ACCESS_TOKEN_PRIVATE_KEY: (0, envalid_1.str)(),
        REFRESH_TOKEN_PRIVATE_KEY: (0, envalid_1.str)(),
        PORT: (0, envalid_1.port)({ default: 5000 }),
        NUM_PHYSICAL_CPUS: (0, envalid_1.num)(),
        DATABASE_URL: (0, envalid_1.str)(),
    });
    return env;
}
exports.default = validateEnv;
