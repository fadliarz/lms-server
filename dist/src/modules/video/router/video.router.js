"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const video_type_1 = require("../video.type");
function CourseLessonVideoRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(video_type_1.CourseLessonVideoDITypes.CONTROLLER);
    /**
     * Create
     *
     */
    router.post(video_type_1.courseLessonVideoUrls.root, authenticationMiddleware, controller.createVideo.bind(controller));
    /**
     * Get
     *
     */
    router.get(video_type_1.courseLessonVideoUrls.root, authenticationMiddleware, controller.getVideos.bind(controller));
    router.get(video_type_1.courseLessonVideoUrls.video, authenticationMiddleware, controller.getVideoById.bind(controller));
    /**
     * Update
     *
     */
    router.patch(video_type_1.courseLessonVideoUrls.basic, authenticationMiddleware, controller.updateBasicVideo.bind(controller));
    router.patch(video_type_1.courseLessonVideoUrls.source, authenticationMiddleware, controller.updateVideoSource.bind(controller));
    /**
     * Delete
     *
     */
    router.delete(video_type_1.courseLessonVideoUrls.video, authenticationMiddleware, controller.deleteVideo.bind(controller));
    return router;
}
exports.default = CourseLessonVideoRouter;
