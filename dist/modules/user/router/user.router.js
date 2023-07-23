"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const user_type_1 = require("../user.type");
const validationMiddleware_1 = require("../../../middlewares/validationMiddleware");
const user_joi_1 = require("../controller/user.joi");
const user_type_2 = require("../user.type");
function UserRouter(authMiddleware) {
    const router = express_1.default.Router();
    const userControllerInstance = inversifyConfig_1.default.get(user_type_1.UserDITypes.USER_CONTROLLER);
    router.post(user_type_2.userUrls.signUp, (0, validationMiddleware_1.validationMiddleware)(user_joi_1.SignIn), userControllerInstance.signUp.bind(userControllerInstance));
    router.post(user_type_2.userUrls.signIn, (0, validationMiddleware_1.validationMiddleware)(user_joi_1.SignUp), userControllerInstance.signIn.bind(userControllerInstance));
    router.put(user_type_2.userUrls.logOut, authMiddleware, userControllerInstance.logOut.bind(userControllerInstance));
    return router;
}
exports.default = UserRouter;
