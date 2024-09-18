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
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
let DepartmentDivisionEnrollmentRepository = class DepartmentDivisionEnrollmentRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createEnrollment(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (id.resourceId) {
                const division = yield this.db.departmentDivision.findFirst({
                    where: {
                        id: id.divisionId,
                        department: { id: id.resourceId.departmentId },
                    },
                });
                if (!division) {
                    throw new RecordNotFoundException_1.default();
                }
            }
            return this.db.departmentDivisionEnrollment.create({
                data: Object.assign(Object.assign({}, dto), { divisionId: id.divisionId }),
            });
        });
    }
    getEnrollments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.departmentDivisionEnrollment.findMany({
                where: id.resourceId
                    ? {
                        division: {
                            id: id.divisionId,
                            departmentId: id.resourceId.departmentId,
                        },
                    }
                    : { divisionId: id.divisionId },
            });
        });
    }
    getEnrollmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.departmentDivisionEnrollment.findFirst({
                where: this.getWhereObject(id),
            });
        });
    }
    getEnrollmentByIdOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield this.getEnrollmentById(id);
            if (!enrollment) {
                throw error || new RecordNotFoundException_1.default();
            }
            return enrollment;
        });
    }
    deleteEnrollment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.departmentDivisionEnrollment.delete({
                where: this.getWhereObject(id),
                select: { id: true },
            });
        });
    }
    getWhereObject(id) {
        if (id.resourceId) {
            return {
                id: id.enrollmentId,
                division: {
                    id: id.resourceId.divisionId,
                    departmentId: id.resourceId.departmentId,
                },
            };
        }
        return { id: id.enrollmentId };
    }
};
DepartmentDivisionEnrollmentRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], DepartmentDivisionEnrollmentRepository);
exports.default = DepartmentDivisionEnrollmentRepository;
