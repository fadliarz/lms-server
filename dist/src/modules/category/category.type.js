"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseCategoryUrls = exports.CourseCategoryDITypes = void 0;
exports.CourseCategoryDITypes = {
    REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};
var courseCategoryUrls;
(function (courseCategoryUrls) {
    courseCategoryUrls["root"] = "/categories";
    courseCategoryUrls["category"] = "/:categoryId";
})(courseCategoryUrls || (exports.courseCategoryUrls = courseCategoryUrls = {}));
