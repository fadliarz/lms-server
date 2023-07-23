"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUrls = exports.UserDITypes = void 0;
exports.UserDITypes = {
    USER_REPOSITORY: Symbol.for("USER_REPOSITORY"),
    USER_SERVICE: Symbol.for("USER_SERVICE"),
    USER_CONTROLLER: Symbol.for("USER_CONTROLLER"),
};
var userUrls;
(function (userUrls) {
    userUrls["root"] = "/auth";
    userUrls["signUp"] = "/signup";
    userUrls["signIn"] = "/signin";
    userUrls["logOut"] = "/logout";
})(userUrls || (exports.userUrls = userUrls = {}));
