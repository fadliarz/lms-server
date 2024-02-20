"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseCategoryController = void 0;
require("reflect-metadata");
const inversify_1 = require("inversify");
const category_type_1 = require("../category.type");
const statusCode_1 = require("../../../common/constants/statusCode");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const category_joi_1 = require("./category.joi");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
let CourseCategoryController = class CourseCategoryController {
    createCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: category_joi_1.CreateCourseCategoryDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newCategory = yield this.service.createCategory(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newCategory,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getCategories(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.service.getCategories();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: categories });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateCategory(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: category_joi_1.UpdateCourseCategoryDtoJoi })(req, res, next);
                const categoryId = this.validateCategoryId(req);
                const resourceId = this.validateResourceId(req);
                const updatedCategory = yield this.service.updateCategory(categoryId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({ data: updatedCategory });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req, error) {
        const { id: userId } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        return {
            userId,
        };
    }
    validateCategoryId(req, error) {
        const categoryId = Number(req.params.lessonId);
        if (isNaN(categoryId)) {
            throw error || new NaNException_1.default("categoryId");
        }
        return categoryId;
    }
};
exports.CourseCategoryController = CourseCategoryController;
__decorate([
    (0, inversify_1.inject)(category_type_1.CourseCategoryDITypes.SERVICE),
    __metadata("design:type", Object)
], CourseCategoryController.prototype, "service", void 0);
exports.CourseCategoryController = CourseCategoryController = __decorate([
    (0, inversify_1.injectable)()
], CourseCategoryController);
