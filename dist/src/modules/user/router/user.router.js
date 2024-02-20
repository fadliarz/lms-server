"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const user_type_1 = require("../user.type");
const validationMiddleware_1 = require("../../../middlewares/validationMiddleware");
const user_joi_1 = require("../controller/user.joi");
const user_type_2 = require("../user.type");
function UserRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(user_type_1.UserDITypes.CONTROLLER);
    /**
     * Create
     */
    router.post(user_type_2.userUrls.signUp, (0, validationMiddleware_1.validationMiddleware)({
        body: user_joi_1.SignUp,
    }), controller.createUser.bind(controller));
    /**
     * Get
     */
    router.get(user_type_2.userUrls.user, controller.getUserById.bind(controller));
    router.get(user_type_2.userUrls.user.concat("/:email"), controller.getUserByEmail.bind(controller));
    router.get(user_type_2.userUrls.user, authenticationMiddleware, controller.getMe.bind(controller));
    /**
     * Update
     */
    router.post(user_type_2.userUrls.signIn, (0, validationMiddleware_1.validationMiddleware)({ body: user_joi_1.SignIn }), controller.signIn.bind(controller));
    router.put(user_type_2.userUrls.logOut, authenticationMiddleware, controller.signOut.bind(controller));
    return router;
}
exports.default = UserRouter;
