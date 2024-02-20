"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inversifyConfig_1 = __importDefault(require("../../../inversifyConfig"));
const category_type_1 = require("../category.type");
function CourseCategoryRouter(authenticationMiddleware) {
    const router = express_1.default.Router();
    const controller = inversifyConfig_1.default.get(category_type_1.CourseCategoryDITypes.CONTROLLER);
    /**
     * Create (CourseCategory)
     *
     */
    router.post("/", authenticationMiddleware, controller.createCategory.bind(controller));
    /**
     * Get (CourseCategory)
     *
     */
    router.get(category_type_1.courseCategoryUrls.category, controller.getCategories.bind(controller));
    return router;
}
exports.default = CourseCategoryRouter;
