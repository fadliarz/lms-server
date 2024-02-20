"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = exports.userUrls = exports.UserDITypes = void 0;
const client_1 = require("@prisma/client");
exports.UserDITypes = {
    REPOSITORY: Symbol.for("USER_REPOSITORY"),
    SERVICE: Symbol.for("USER_SERVICE"),
    CONTROLLER: Symbol.for("USER_CONTROLLER"),
};
var userUrls;
(function (userUrls) {
    userUrls["root"] = "/users";
    userUrls["me"] = "/me";
    userUrls["user"] = "/:userId";
    userUrls["signUp"] = "/signup";
    userUrls["signIn"] = "/signin";
    userUrls["logOut"] = "/logout";
})(userUrls || (exports.userUrls = userUrls = {}));
exports.UserRole = client_1.Role;
