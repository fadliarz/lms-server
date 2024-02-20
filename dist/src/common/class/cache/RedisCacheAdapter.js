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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
class RedisCacheAdapter {
    constructor() {
        this.initialiseClientConnection();
    }
    hSet(key, value, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.client.hSet(key, this.serializeObject(value));
        });
    }
    hGetAll(key, mockObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const storedObject = (yield this.client.hGetAll(key));
            return this.deserializeObject(storedObject, mockObject);
        });
    }
    serializeObject(obj) {
        const serializedObject = {};
        for (const key in obj) {
            const value = obj[key];
            let serializedValue = value;
            if (typeof value === "number") {
                serializedValue = value.toString();
            }
            serializedObject[key] = serializedValue;
        }
        return serializedObject;
    }
    deserializeObject(storedObject, mockObject) {
        const deserializedObject = {};
        for (const key in storedObject) {
            const value = storedObject[key];
            let deserializedValue = value;
            if (typeof mockObject[key] === "number") {
                deserializedValue = Number(value);
            }
            deserializedObject[key] = deserializedValue;
        }
        return deserializedObject;
    }
    initialiseClientConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield (0, redis_1.createClient)();
            yield this.client.connect().then((res) => {
                console.log("Connected to redis!");
            });
        });
    }
}
exports.default = RedisCacheAdapter;
