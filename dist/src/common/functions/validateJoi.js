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
const HttpException_1 = __importDefault(require("../class/exceptions/HttpException"));
const statusCode_1 = require("../constants/statusCode");
const errorCode_1 = require("../constants/errorCode");
const errorMessage_1 = require("../constants/errorMessage");
function validateJoi(obj) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let errorMessage = [];
        const validationOptions = {
            abortEarly: false,
            allowUknown: false,
            stripUnkown: false,
        };
        try {
            if (obj.body) {
                yield obj.body.validateAsync(req.body, validationOptions);
            }
        }
        catch (error) {
            error.details.forEach((error) => {
                errorMessage.push(error.message);
            });
            throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.INVALID_BODY, errorMessage || errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.INVALID_BODY], true);
        }
        try {
            if (obj.query) {
                yield obj.query.validateAsync(req.query, validationOptions);
            }
        }
        catch (error) {
            error.details.forEach((error) => {
                errorMessage.push(error.message);
            });
            throw new HttpException_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorCode_1.ErrorCode.INVALID_QUERY, errorMessage || errorMessage_1.ErrorMessage[errorCode_1.ErrorCode.INVALID_QUERY], true);
        }
    });
}
exports.default = validateJoi;
