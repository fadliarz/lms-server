"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const user_type_1 = require("../user.type");
const user_type_2 = require("../user.type");
function UserRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(user_type_1.UserDITypes.CONTROLLER);
    /**
     * SignIn
     *
     */
    router.post(user_type_2.userUrls.signIn, controller.signIn.bind(controller));
    /**
     * SignOut
     *
     */
    router.post(user_type_2.userUrls.signOut, authenticationMiddleware, controller.signOut.bind(controller));
    /**
     * Create
     *
     */
    router.post("/", controller.createUser.bind(controller));
    /**
     * Get
     *
     */
    router.get(user_type_2.userUrls.me, authenticationMiddleware, controller.getMe.bind(controller));
    router.get(user_type_2.userUrls.public, controller.getPublicUserById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(user_type_2.userUrls.basic, authenticationMiddleware, controller.updateBasicUser.bind(controller));
    router.patch(user_type_2.userUrls.email, authenticationMiddleware, controller.updateUserEmail.bind(controller));
    router.patch(user_type_2.userUrls.password, authenticationMiddleware, controller.updateUserPassword.bind(controller));
    router.patch(user_type_2.userUrls.phoneNumber, authenticationMiddleware, controller.updateUserPhoneNumber.bind(controller));
    /**
     * Delete
     *
     */
    router.patch(user_type_2.userUrls.user, authenticationMiddleware, controller.deleteUser.bind(controller));
    return router;
}
exports.default = UserRouter;
