"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookie = void 0;
var Cookie;
(function (Cookie) {
    Cookie["ACCESS_TOKEN"] = "accessToken";
    Cookie[Cookie["ACCESS_TOKEN_EXPIRES_IN_HOUR"] = 1] = "ACCESS_TOKEN_EXPIRES_IN_HOUR";
    Cookie["REFRESH_TOKEN"] = "refreshToken";
    Cookie[Cookie["REFRESH_TOKEN_EXPIRES_IN_DAY"] = 1] = "REFRESH_TOKEN_EXPIRES_IN_DAY";
})(Cookie || (exports.Cookie = Cookie = {}));
