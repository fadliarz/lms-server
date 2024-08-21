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
const program_type_1 = require("../program.type");
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
let DepartmentProgramService = class DepartmentProgramService extends BaseAuthorization_1.default {
    createProgram(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeCreateProgram(user, id.resourceId.departmentId);
                return yield this.repository.createProgram({ departmentId: id.resourceId.departmentId }, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    getAllPrograms() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getAllPrograms();
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getPrograms(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getPrograms(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    getProgramById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.getProgramById(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error);
            }
        });
    }
    updateProgram(user, id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeUpdateProgram(user, id.resourceId.departmentId);
                return yield this.repository.updateProgram(id, dto);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    deleteProgram(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.authorization.authorizeDeleteProgram(user, id.resourceId.departmentId);
                return yield this.repository.deleteProgram(id);
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(program_type_1.DepartmentProgramDITypes.REPOSITORY),
    __metadata("design:type", Object)
], DepartmentProgramService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(program_type_1.DepartmentProgramDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], DepartmentProgramService.prototype, "authorization", void 0);
DepartmentProgramService = __decorate([
    (0, inversify_1.injectable)()
], DepartmentProgramService);
exports.default = DepartmentProgramService;
