"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const event_type_1 = require("../event.type");
function EventRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(event_type_1.EventDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(event_type_1.$EventAPI.CreateEvent.endpoint, authenticationMiddleware, controller.createEvent.bind(controller));
    /**
     * Get
     *
     */
    router.get(event_type_1.$EventAPI.GetEvents.endpoint, authenticationMiddleware, controller.getEvents.bind(controller));
    router.get(event_type_1.$EventAPI.GetEventById.endpoint, authenticationMiddleware, controller.getEventById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(event_type_1.$EventAPI.UpdateEvent.endpoint, authenticationMiddleware, controller.updateEvent.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(event_type_1.$EventAPI.DeleteEvent.endpoint, authenticationMiddleware, controller.deleteEvent.bind(controller));
    return router;
}
exports.default = EventRouter;
