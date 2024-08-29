"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDITypes = void 0;
exports.EventDITypes = {
    REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
    SERVICE: Symbol.for("EVENT_SERVICE"),
    CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
};
