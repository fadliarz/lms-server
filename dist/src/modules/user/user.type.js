"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUrls = exports.UserDITypes = void 0;
exports.UserDITypes = {
    REPOSITORY: Symbol.for("USER_REPOSITORY"),
    SERVICE: Symbol.for("USER_SERVICE"),
    CONTROLLER: Symbol.for("USER_CONTROLLER"),
    AUTHORIZATION: Symbol.for("USER_AUTHORIZATION"),
};
var userUrls;
(function (userUrls) {
    userUrls["root"] = "/users";
    userUrls["user"] = "/:userId";
    userUrls["me"] = "/me";
    userUrls["public"] = "/:userId/public";
    userUrls["basic"] = "/:userId/basic";
    userUrls["email"] = "/:userId/email";
    userUrls["password"] = "/:userId/password";
    userUrls["phoneNumber"] = "/:userId/phone";
    userUrls["assignments"] = "/:userId/assignments";
    userUrls["signIn"] = "/signin";
    userUrls["signOut"] = "/signout";
})(userUrls || (exports.userUrls = userUrls = {}));
