"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function filterPublicData(user) {
    user.accessToken = "undefined";
    user.refreshToken = [];
    user.password = "undefined";
    return user;
}
exports.default = filterPublicData;
