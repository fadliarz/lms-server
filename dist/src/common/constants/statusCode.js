"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
    StatusCode[StatusCode["NO_CONTENT"] = 200] = "NO_CONTENT";
    StatusCode[StatusCode["RESOURCE_CREATED"] = 201] = "RESOURCE_CREATED";
    StatusCode[StatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCode[StatusCode["UNAUTHENTICATED"] = 401] = "UNAUTHENTICATED";
    StatusCode[StatusCode["UNAUTHORIZED"] = 403] = "UNAUTHORIZED";
    StatusCode[StatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCode[StatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    StatusCode[StatusCode["CONFLICT"] = 409] = "CONFLICT";
    StatusCode[StatusCode["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
