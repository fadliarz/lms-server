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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const division_type_1 = require("../division.type");
const PrismaClientSingleton_1 = __importDefault(require("../../../common/class/PrismaClientSingleton"));
const asyncLocalStorage_1 = __importDefault(require("../../../common/asyncLocalStorage"));
const LocalStorageKey_1 = require("../../../common/constants/LocalStorageKey");
const handleRepositoryError_1 = __importDefault(require("../../../common/functions/handleRepositoryError"));
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const ClientException_1 = __importDefault(require("../../../common/class/exceptions/ClientException"));
let DepartmentDivisionService = class DepartmentDivisionService extends BaseAuthorization_1.default {
    constructor() {
        super(...arguments);
        this.prisma = PrismaClientSingleton_1.default.getInstance();
    }
    createDivision(resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId } } = resourceId, resources = __rest(resourceId, ["user"]);
                    const { departmentId } = resources;
                    const { leaderId, coLeaderId } = dto;
                    const user = yield this.globalRepository.user.getUserByIdOrThrow({
                        userId,
                    });
                    const department = yield this.globalRepository.department.getDepartmentByIdOrThrow(departmentId);
                    this.authorization.authorizeCreateDivision(user, department);
                    if (leaderId && coLeaderId && leaderId == coLeaderId) {
                        throw new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.createDivision(Object.assign(Object.assign({}, resources), dto));
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    getDivisions(resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getDivisions(resourceId.departmentId);
        });
    }
    getDivisionById(divisionId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.validateRelationBetweenResources(divisionId, resourceId);
        });
    }
    updateDivision(divisionId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId } } = resourceId, resources = __rest(resourceId, ["user"]);
                    const { departmentId } = resources;
                    const user = yield this.globalRepository.user.getUserByIdOrThrow({
                        userId,
                    });
                    const department = yield this.globalRepository.department.getDepartmentByIdOrThrow(departmentId);
                    const division = yield this.getDivisionById(divisionId, resourceId);
                    this.authorization.authorizeUpdateDivision(user, department, division);
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDivision(divisionId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    updateDivisionLeaderId(divisionId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId } } = resourceId, resources = __rest(resourceId, ["user"]);
                    const { departmentId } = resources;
                    const { leaderId } = dto;
                    const user = yield this.globalRepository.user.getUserByIdOrThrow({
                        userId,
                    });
                    const department = yield this.globalRepository.department.getDepartmentByIdOrThrow(departmentId);
                    this.authorization.authorizeUpdateDivisionLeaderId(user, department);
                    if (department.coLeaderId == leaderId) {
                        throw new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    yield this.globalRepository.user.getUserByIdOrThrow({ userId }, new RecordNotFoundException_1.default(`user with id ${leaderId} doesn't exist!`));
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDivision(divisionId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    updateDivisionCoLeaderId(divisionId, resourceId, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const { user: { id: userId } } = resourceId, resources = __rest(resourceId, ["user"]);
                    const { departmentId } = resources;
                    const { coLeaderId } = dto;
                    const user = yield this.globalRepository.user.getUserByIdOrThrow({
                        userId,
                    });
                    const department = yield this.globalRepository.department.getDepartmentByIdOrThrow(departmentId);
                    this.authorization.authorizeUpdateDivisionCoLeaderId(user, department);
                    if (department.leaderId == coLeaderId) {
                        throw new ClientException_1.default("leaderId and coLeaderId should be distinct!");
                    }
                    yield this.globalRepository.user.getUserByIdOrThrow({ userId: coLeaderId }, new RecordNotFoundException_1.default(`user with id ${coLeaderId} doesn't exist!`));
                    return yield asyncLocalStorage_1.default.run({ [LocalStorageKey_1.LocalStorageKey.TRANSACTION]: tx }, () => __awaiter(this, void 0, void 0, function* () {
                        return this.repository.updateDivision(divisionId, dto);
                    }));
                }));
            }
            catch (error) {
                throw (0, handleRepositoryError_1.default)(error, {});
            }
        });
    }
    deleteDivision(divisionId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateRelationBetweenResources(divisionId, resourceId);
            yield this.repository.deleteDivision(divisionId);
            return {};
        });
    }
    validateRelationBetweenResources(divisionId, resourceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { departmentId } = resourceId;
            const division = yield this.repository.getDivisionById(divisionId);
            if (!division || division.departmentId !== departmentId) {
                throw new RecordNotFoundException_1.default("");
            }
            return division;
        });
    }
};
__decorate([
    (0, inversify_1.inject)(division_type_1.DepartmentDivisionDITypes.REPOSITORY),
    __metadata("design:type", Object)
], DepartmentDivisionService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(division_type_1.DepartmentDivisionDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], DepartmentDivisionService.prototype, "authorization", void 0);
DepartmentDivisionService = __decorate([
    (0, inversify_1.injectable)()
], DepartmentDivisionService);
exports.default = DepartmentDivisionService;
