"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoryDITypes = exports.$CourseCategoryAPI = void 0;
var $CourseCategoryAPI;
(function ($CourseCategoryAPI) {
    const root = "/categories";
    const category = root + "/:categoryId";
    let CreateCategory;
    (function (CreateCategory) {
        CreateCategory.endpoint = root;
        CreateCategory.generateUrl = () => root;
    })(CreateCategory = $CourseCategoryAPI.CreateCategory || ($CourseCategoryAPI.CreateCategory = {}));
    let GetCategories;
    (function (GetCategories) {
        GetCategories.endpoint = root;
        GetCategories.generateUrl = () => root;
    })(GetCategories = $CourseCategoryAPI.GetCategories || ($CourseCategoryAPI.GetCategories = {}));
    let GetCategoryById;
    (function (GetCategoryById) {
        GetCategoryById.endpoint = category;
        GetCategoryById.generateUrl = (categoryId) => `/categories/${categoryId}`;
    })(GetCategoryById = $CourseCategoryAPI.GetCategoryById || ($CourseCategoryAPI.GetCategoryById = {}));
    let UpdateCategory;
    (function (UpdateCategory) {
        UpdateCategory.endpoint = category;
        UpdateCategory.generateUrl = (categoryId) => `/categories/${categoryId}`;
    })(UpdateCategory = $CourseCategoryAPI.UpdateCategory || ($CourseCategoryAPI.UpdateCategory = {}));
    let DeleteCategory;
    (function (DeleteCategory) {
        DeleteCategory.endpoint = category;
        DeleteCategory.generateUrl = (categoryId) => `/categories/${categoryId}`;
    })(DeleteCategory = $CourseCategoryAPI.DeleteCategory || ($CourseCategoryAPI.DeleteCategory = {}));
})($CourseCategoryAPI || (exports.$CourseCategoryAPI = $CourseCategoryAPI = {}));
exports.CourseCategoryDITypes = {
    REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
    SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
    CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
    AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};
