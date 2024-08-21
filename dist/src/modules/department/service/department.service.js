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
const department_type_1 = require("../department.type");
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
let DepartmentService = class DepartmentService extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createDepartment(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId }, } = resourceId;
                    const { leaderId, coLeaderId } = dto;
                    yield this.authorizeUserRole(tx, resourceId, this.authorization.authorizeCreateDepartment.bind(this.authorization));
                    if (leaderId && coLeaderId && leaderId == coLeaderId) {
                        new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    if (leaderId) {
                        yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new RecordNotFoundException_1.default(`user with id ${leaderId} doesn't exist!`));
                    }
                    if (coLeaderId) {
                        yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, coLeaderId, new RecordNotFoundException_1.default(`user with id ${coLeaderId} doesn't exist!`));
                    }
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.createDepartment(dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    getDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getDepartments();
        });
    }
    getDepartmentById(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getDepartmentByIdOrThrow(departmentId);
        });
    }
    updateDepartment(departmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId }, } = resourceId;
                    const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new RecordNotFoundException_1.default());
                    const department = yield this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(tx, departmentId, new RecordNotFoundException_1.default());
                    this.authorization.authorizeUpdateDepartment(user, department);
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDepartment(departmentId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    updateDepartmentLeaderId(departmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId }, } = resourceId;
                    const { leaderId } = dto;
                    const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new RecordNotFoundException_1.default());
                    const department = yield this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(tx, departmentId, new RecordNotFoundException_1.default());
                    this.authorization.authorizeUpdateDepartment(user, department);
                    if (department.coLeaderId == leaderId) {
                        throw new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    yield this.globalRepository.user.getUserByIdOrThrow({ userId: leaderId }, new RecordNotFoundException_1.default(`user with id ${leaderId} doesn't exist!`));
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDepartment(departmentId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    updateDepartmentCoLeaderId(departmentId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId }, } = resourceId;
                    const { coLeaderId } = dto;
                    const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new RecordNotFoundException_1.default());
                    const department = yield this.prismaQueryRaw.department.selectForUpdateByIdOrThrow(tx, departmentId, new RecordNotFoundException_1.default());
                    this.authorization.authorizeUpdateDepartment(user, department);
                    if (department.leaderId == coLeaderId) {
                        throw new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    yield this.globalRepository.user.getUserByIdOrThrow({ userId: coLeaderId }, new RecordNotFoundException_1.default(`user with id ${coLeaderId} doesn't exist!`));
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDepartment(departmentId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    deleteDepartment(departmentId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId }, } = resourceId;
                    const user = yield this.prismaQueryRaw.user.selectForUpdateByIdOrThrow(tx, userId, new RecordNotFoundException_1.default());
                    this.authorization.authorizeDeleteDepartment(user);
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.deleteDepartment(departmentId);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
};
__decorate([
    (0, inversify_1.inject)(department_type_1.DepartmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], DepartmentService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(department_type_1.DepartmentDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], DepartmentService.prototype, "authorization", void 0);
DepartmentService = __decorate([
    (0, inversify_1.injectable)()
], DepartmentService);
exports.default = DepartmentService;
