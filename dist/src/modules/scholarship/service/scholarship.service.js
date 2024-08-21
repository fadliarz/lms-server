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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const scholarship_type_1 = require("../scholarship.type");
let ScholarshipService = class ScholarshipService {
    createScholarship(user, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorization.authorizeCreateScholarship(user);
            return this.repository.createScholarship(dto);
        });
    }
    getScholarships() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getScholarships();
        });
    }
    getScholarshipById(scholarshipId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.repository.getScholarshipByIdOrThrow(scholarshipId);
        });
    }
    updateScholarship(scholarshipId, user, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorization.authorizeUpdateScholarship(user);
            return this.repository.updateScholarship(scholarshipId, dto);
        });
    }
    deleteScholarship(scholarshipId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorization.authorizeDeleteScholarship(user);
            return this.repository.deleteScholarship(scholarshipId);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(scholarship_type_1.ScholarshipDITypes.REPOSITORY),
    __metadata("design:type", Object)
], ScholarshipService.prototype, "repository", void 0);
__decorate([
    (0, inversify_1.inject)(scholarship_type_1.ScholarshipDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], ScholarshipService.prototype, "authorization", void 0);
ScholarshipService = __decorate([
    (0, inversify_1.injectable)()
], ScholarshipService);
exports.default = ScholarshipService;
