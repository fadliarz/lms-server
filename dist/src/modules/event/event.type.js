"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDITypes = exports.$EventAPI = void 0;
var $EventAPI;
(function ($EventAPI) {
    const root = "/events";
    const event = root + "/:eventId";
    let CreateEvent;
    (function (CreateEvent) {
        CreateEvent.endpoint = root;
        CreateEvent.generateUrl = () => root;
    })(CreateEvent = $EventAPI.CreateEvent || ($EventAPI.CreateEvent = {}));
    let GetEvents;
    (function (GetEvents) {
        GetEvents.endpoint = root;
        GetEvents.generateUrl = () => root;
    })(GetEvents = $EventAPI.GetEvents || ($EventAPI.GetEvents = {}));
    let GetEventById;
    (function (GetEventById) {
        GetEventById.endpoint = event;
        GetEventById.generateUrl = (eventId) => `/events/${eventId}`;
    })(GetEventById = $EventAPI.GetEventById || ($EventAPI.GetEventById = {}));
    let UpdateEvent;
    (function (UpdateEvent) {
        UpdateEvent.endpoint = event;
        UpdateEvent.generateUrl = (eventId) => `/events/${eventId}`;
    })(UpdateEvent = $EventAPI.UpdateEvent || ($EventAPI.UpdateEvent = {}));
    let DeleteEvent;
    (function (DeleteEvent) {
        DeleteEvent.endpoint = event;
        DeleteEvent.generateUrl = (eventId) => `/events/${eventId}`;
    })(DeleteEvent = $EventAPI.DeleteEvent || ($EventAPI.DeleteEvent = {}));
})($EventAPI || (exports.$EventAPI = $EventAPI = {}));
exports.EventDITypes = {
    REPOSITORY: Symbol.for("EVENT_REPOSITORY"),
    SERVICE: Symbol.for("EVENT_SERVICE"),
    CONTROLLER: Symbol.for("EVENT_CONTROLLER"),
    AUTHORIZATION: Symbol.for("EVENT_AUTHORIZATION"),
};
