"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const inversify_1 = require("inversify");
let DepartmentAuthorization = class DepartmentAuthorization {
    authorizeCreateDepartment(user) {
        const { isAdmin } = (0, getRoleStatus_1.default)(user.role);
        let isAuthorized = false;
        if (isAdmin) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateDepartment(user, department) {
        const { id: userId } = user;
        const { isAdmin } = (0, getRoleStatus_1.default)(user.role);
        const { leaderId, coLeaderId } = department;
        let isAuthorized = false;
        if (isAdmin || userId == leaderId || userId == coLeaderId) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateDepartmentLeaderId(user, department) {
        this.authorizeCreateDepartment(user);
    }
    authorizeUpdateDepartmentCoLeaderId(user, department) {
        this.authorizeCreateDepartment(user);
    }
    authorizeDeleteDepartment(user) {
        this.authorizeCreateDepartment(user);
    }
};
DepartmentAuthorization = __decorate([
    (0, inversify_1.injectable)()
], DepartmentAuthorization);
exports.default = DepartmentAuthorization;
