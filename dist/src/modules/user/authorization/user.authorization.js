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
require("reflect-metadata");
const inversify_1 = require("inversify");
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const user_type_1 = require("../user.type");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
let UserAuthorization = class UserAuthorization extends BaseAuthorization_1.default {
    authorizeGetUserPermissions(user, targetUserId) {
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isStudent && user.id == targetUserId) {
            isAuthorized = true;
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeGetUserAssignments(user, targetUserId) {
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isStudent && user.id == targetUserId) {
            isAuthorized = true;
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeGetUserEnrolledAsStudentCourses(user, targetUserId) {
        this.authorizeGetUserAssignments(user, targetUserId);
    }
    authorizeGetUserManagedCourses(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(user.role);
            let isAuthorized = false;
            if (isStudent && user.id === targetUserId) {
                isAuthorized = true;
            }
            if (isAdmin) {
                isAuthorized = true;
            }
            if (!isAuthorized) {
                throw new AuthorizationException_1.default();
            }
        });
    }
    authorizeGetUserEventAndCourseSchedules(user, targetUserId) {
        this.authorizeGetUserAssignments(user, targetUserId);
    }
    authorizeGetUserEnrolledDepartmentPrograms(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role: userRole } = user;
            const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(userRole);
            let isAuthorized = false;
            if (isStudent) {
                if (userId === targetUserId) {
                    isAuthorized = true;
                }
                if (!isAuthorized) {
                    isAuthorized =
                        yield this.globalRepository.user.getUserAuthorizationStatusFromPrivilege({ userId: user.id }, user_type_1.PrivilegeModel.PROGRAM);
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
    authorizeGetUserManagedDepartments(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isStudent, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            let isAuthorized = false;
            if (isStudent && user.id === targetUserId) {
                isAuthorized = true;
            }
            if (isAdmin) {
                isAuthorized = true;
            }
            if (!isAuthorized) {
                throw new AuthorizationException_1.default();
            }
        });
    }
    authorizeGetUserManagedDepartmentDivisions(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorizeGetUserManagedDepartments(user, targetUserId);
        });
    }
    authorizeGetUserReport(user, targetUserId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id: userId, role: userRole } = user;
            const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(userRole);
            let isAuthorized = false;
            if (isStudent) {
                if (userId === targetUserId) {
                    isAuthorized = true;
                }
                if (!isAuthorized) {
                    isAuthorized =
                        yield this.globalRepository.user.getUserAuthorizationStatusFromPrivilege({ userId: user.id }, user_type_1.PrivilegeModel.REPORT);
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
    authorizeUpdateUser(user, targetUserId) {
        const { id: userId, role: userRole } = user;
        const { isAdmin, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (isStudent && userId === targetUserId) {
            isAuthorized = true;
        }
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeDeleteUser(user, targetUserId) {
        this.authorizeUpdateUser(user, targetUserId);
    }
};
UserAuthorization = __decorate([
    (0, inversify_1.injectable)()
], UserAuthorization);
exports.default = UserAuthorization;
