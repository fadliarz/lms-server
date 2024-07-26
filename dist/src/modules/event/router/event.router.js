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
    router.post("/", authenticationMiddleware, controller.create.bind(controller));
    /**
     * Get
     *
     */
    router.get("/", authenticationMiddleware, controller.getMany.bind(controller));
    router.get(event_type_1.eventUrls.event, authenticationMiddleware, controller.getById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(event_type_1.eventUrls.event, authenticationMiddleware, controller.update.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(event_type_1.eventUrls.event, authenticationMiddleware, controller.delete.bind(controller));
}
exports.default = EventRouter;
