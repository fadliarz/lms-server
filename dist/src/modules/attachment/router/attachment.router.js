"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const attachment_type_1 = require("../attachment.type");
const attachment_api_1 = require("../attachment.api");
function CourseLessonAttachmentRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(attachment_type_1.CourseLessonAttachmentDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(attachment_api_1.$CourseLessonAttachmentAPI.CreateAttachment.endpoint, authenticationMiddleware, controller.createAttachment.bind(controller));
    /**
     * Get
     *
     */
    router.get(attachment_api_1.$CourseLessonAttachmentAPI.GetAttachments.endpoint, authenticationMiddleware, controller.getAttachments.bind(controller));
    router.get(attachment_api_1.$CourseLessonAttachmentAPI.GetAttachmentById.endpoint, authenticationMiddleware, controller.getAttachmentById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(attachment_api_1.$CourseLessonAttachmentAPI.UpdateAttachment.endpoint, authenticationMiddleware, controller.updateAttachment.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(attachment_api_1.$CourseLessonAttachmentAPI.DeleteAttachment.endpoint, authenticationMiddleware, controller.deleteAttachment.bind(controller));
    return router;
}
exports.default = CourseLessonAttachmentRouter;
