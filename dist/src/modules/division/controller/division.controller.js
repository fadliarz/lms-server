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
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const division_type_1 = require("../division.type");
const division_joi_1 = require("./division.joi");
let DepartmentDivisionController = class DepartmentDivisionController {
    createDivision(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: division_joi_1.CreateDepartmentDivisionDtoJoi })(req, res, next);
                const resourceId = this.validateResourceId(req);
                const newAssignment = yield this.service.createDivision(resourceId, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newAssignment,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDivisionById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const divisionId = this.validateDivisionId(req);
                const resourceId = this.validateResourceId(req);
                const division = yield this.service.getDivisionById(divisionId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: division,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getDivisions(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resourceId = this.validateResourceId(req);
                const divisions = yield this.service.getDivisions(resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: divisions,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDivision(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: division_joi_1.UpdateDepartmentDivisionDtoJoi })(req, res, next);
                const divisionId = this.validateDivisionId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDivision = yield this.service.updateDivision(divisionId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDivision,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDivisionLeaderId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: division_joi_1.UpdateDepartmentDivisionLeaderIdDtoJoi })(req, res, next);
                const divisionId = this.validateDivisionId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDivision = yield this.service.updateDivisionLeaderId(divisionId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDivision,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateDivisionCoLeaderId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: division_joi_1.UpdateDepartmentDivisionCoLeaderIdDtoJoi })(req, res, next);
                const divisionId = this.validateDivisionId(req);
                const resourceId = this.validateResourceId(req);
                const updatedDivision = yield this.service.updateDivisionCoLeaderId(divisionId, resourceId, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedDivision,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteDivision(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const divisionId = this.validateDivisionId(req);
                const resourceId = this.validateResourceId(req);
                yield this.service.deleteDivision(divisionId, resourceId);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: {},
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    validateResourceId(req) {
        const { id: userId, role } = (0, getRequestUserOrThrowAuthenticationException_1.default)(req);
        const departmentId = Number(req.params.courseId);
        if ((0, isNaNArray_1.default)([departmentId])) {
            throw new NaNException_1.default("departmentId || divisionId");
        }
        return {
            user: {
                id: userId,
                role,
            },
            departmentId,
        };
    }
    validateDivisionId(req) {
        const divisionId = Number(req.params.divisionId);
        if (isNaN(divisionId)) {
            throw new NaNException_1.default("divisionId");
        }
        return divisionId;
    }
};
__decorate([
    (0, inversify_1.inject)(division_type_1.DepartmentDivisionDITypes.SERVICE),
    __metadata("design:type", Object)
], DepartmentDivisionController.prototype, "service", void 0);
DepartmentDivisionController = __decorate([
    (0, inversify_1.injectable)()
], DepartmentDivisionController);
exports.default = DepartmentDivisionController;
