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
exports.validationMiddleware = void 0;
const http_exception_1 = __importDefault(require("../common/exceptions/http.exception"));
const statusCode_1 = require("../common/constants/statusCode");
function validationMiddleware(schema) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const validationOptions = {
            abortEarly: false,
            allowUknown: false,
            stripUnkown: false,
        };
        try {
            const validation = yield schema.validateAsync(req.body, validationOptions);
            next();
        }
        catch (error) {
            const errorsMessage = [];
            error.details.forEach((error) => {
                errorsMessage.push(error.message);
            });
            next(new http_exception_1.default(statusCode_1.StatusCode.BAD_REQUEST, errorsMessage));
        }
    });
}
exports.validationMiddleware = validationMiddleware;
