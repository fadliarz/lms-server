"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const user_type_1 = require("../../user/user.type");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const inversify_1 = require("inversify");
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
let DepartmentProgramEnrollmentAuthorization = class DepartmentProgramEnrollmentAuthorization extends BaseAuthorization_1.default {
    authorizeCreateEnrollment(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isStudent, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            let isAuthorized = false;
            if (isStudent) {
                if (user.id === targetUserId) {
                    isAuthorized = true;
                }
                if (!isAuthorized) {
                    isAuthorized = yield this.authorizeFromDepartmentDivision(user.id, user_type_1.PrivilegeModel.PROGRAM);
                }
            }
            if (isAdmin) {
                isAuthorized = true;
            }
            if (!isAuthorized) {
                throw new AuthorizationException_1.default();
            }
        });
    }
    authorizeDeleteEnrollment(user, enrollment) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role } = user;
            const { isStudent, isAdmin } = (0, getRoleStatus_1.default)(role);
            let isAuthorized = false;
            if (isStudent) {
                if (user.id === enrollment.userId) {
                    isAuthorized = true;
                }
                if (!isAuthorized) {
                    isAuthorized = yield this.authorizeFromDepartmentDivision(user.id, user_type_1.PrivilegeModel.PROGRAM);
                }
            }
            if (isAdmin) {
                isAuthorized = true;
            }
            if (!isAuthorized) {
                throw new AuthorizationException_1.default();
            }
        });
    }
};
DepartmentProgramEnrollmentAuthorization = __decorate([
    (0, inversify_1.injectable)()
], DepartmentProgramEnrollmentAuthorization);
exports.default = DepartmentProgramEnrollmentAuthorization;
