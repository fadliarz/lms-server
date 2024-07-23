"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventErrorMessage = exports.eventUrls = exports.EventDITypes = void 0;
exports.EventDITypes = {
    REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
    SERVICE: Symbol.for("EVENT_SERVICE"),
    CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
};
var eventUrls;
(function (eventUrls) {
})(eventUrls || (exports.eventUrls = eventUrls = {}));
var EventErrorMessage;
(function (EventErrorMessage) {
    EventErrorMessage["EVENT_DOES_NOT_EXIST"] = "event doesn't exist!";
})(EventErrorMessage || (exports.EventErrorMessage = EventErrorMessage = {}));
