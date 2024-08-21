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
const isNaNArray_1 = __importDefault(require("../../../common/functions/isNaNArray"));
const NaNException_1 = __importDefault(require("../../../common/class/exceptions/NaNException"));
const program_type_1 = require("../program.type");
const getRequestUserOrThrowAuthenticationException_1 = __importDefault(require("../../../common/functions/getRequestUserOrThrowAuthenticationException"));
const program_joi_1 = require("./program.joi");
let DepartmentProgramController = class DepartmentProgramController {
    createProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: program_joi_1.CreateDepartmentProgramDtoJoi })(req, res, next);
                const newProgram = yield this.service.createProgram((0, getRequestUserOrThrowAuthenticationException_1.default)(req), { resourceId: this.validateResourceId(req) }, req.body);
                return res.status(statusCode_1.StatusCode.RESOURCE_CREATED).json({
                    data: newProgram,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getAllPrograms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield this.service.getAllPrograms();
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: programs,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getPrograms(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const programs = yield this.service.getPrograms({
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: programs,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    getProgramById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const program = yield this.service.getProgramById({
                    programId: this.validateProgramId(req),
                    resourceId: this.validateResourceId(req),
                });
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: program,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    updateProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield (0, validateJoi_1.default)({ body: program_joi_1.UpdateDepartmentProgramDtoJoi })(req, res, next);
                const updatedProgram = yield this.service.updateProgram((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    programId: this.validateProgramId(req),
                    resourceId: this.validateResourceId(req),
                }, req.body);
                return res.status(statusCode_1.StatusCode.SUCCESS).json({
                    data: updatedProgram,
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    deleteProgram(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteProgram((0, getRequestUserOrThrowAuthenticationException_1.default)(req), {
                    programId: this.validateProgramId(req),
                    resourceId: this.validateResourceId(req),
                });
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
        const departmentId = Number(req.params.departmentId);
        if ((0, isNaNArray_1.default)([departmentId])) {
            throw new NaNException_1.default("departmentId");
        }
        return {
            departmentId,
        };
    }
    validateProgramId(req) {
        const programId = Number(req.params.programId);
        if (isNaN(programId)) {
            throw new NaNException_1.default("programId");
        }
        return programId;
    }
};
__decorate([
    (0, inversify_1.inject)(program_type_1.DepartmentProgramDITypes.SERVICE),
    __metadata("design:type", Object)
], DepartmentProgramController.prototype, "service", void 0);
DepartmentProgramController = __decorate([
    (0, inversify_1.injectable)()
], DepartmentProgramController);
exports.default = DepartmentProgramController;
