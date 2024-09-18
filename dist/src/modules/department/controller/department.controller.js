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
const inversify_1 = require("inversify");
const validateJoi_1 = __importDefault(require("../../../common/functions/validateJoi"));
const statusCode_1 = require("../../../common/constants/statusCode");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const department_type_1 = require("../department.type");
const department_joi_1 = require("./department.joi");
let DepartmentController = class DepartmentController {
    createDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: department_joi_1.CreateDepartmentDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newDepartment = yield this.service.createDepartment(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newDepartment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDepartments(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departments = yield this.service.getDepartments();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: departments,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDepartmentById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentId = this.validateDepartmentId(req);
                const department = yield this.service.getDepartmentById(departmentId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: department,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: department_joi_1.UpdateDepartmentDtoJoi })(req, res, next);
                const departmentId = this.validateDepartmentId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDepartment = yield this.service.updateDepartment(departmentId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDepartment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDepartmentLeaderId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: department_joi_1.UpdateDepartmentLeaderIdDtoJoi })(req, res, next);
                const departmentId = this.validateDepartmentId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDepartment = yield this.service.updateDepartmentLeaderId(departmentId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDepartment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDepartmentCoLeaderId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: department_joi_1.UpdateDepartmentCoLeaderIdDtoJoi })(req, res, next);
                const departmentId = this.validateDepartmentId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDepartment = yield this.service.updateDepartmentCoLeaderId(departmentId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDepartment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const departmentId = this.validateDepartmentId(req);
                const resourceId = this.validateResourceId(req);
                const result = yield this.service.deleteDepartment(departmentId, resourceId);
                res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: result,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const { id: userId, role } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        return {
            user: { id: userId, role },
        };
    }
    validateDepartmentId(req) {
        const departmentId = Number(req.params.departmentId);
        if (isNaN(departmentId)) {
            throw new NaNException_1.default("departmentId");
        }
        return departmentId;
    }
};
__decorate([
    (0, inversify_1.inject)(department_type_1.DepartmentDITypes.SERVICE),
    __metadata("design:type", Object)
], DepartmentController.prototype, "service", void 0);
DepartmentController = __decorate([
    (0, inversify_1.injectable)()
], DepartmentController);
exports.default = DepartmentController;
