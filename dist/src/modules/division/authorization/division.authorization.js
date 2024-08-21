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
const inversify_1 = require("inversify");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
let DepartmentDivisionAuthorization = class DepartmentDivisionAuthorization {
    authorizeCreateDivision(user, department) {
        const { id: userId, role } = user;
        const { leaderId, coLeaderId } = department;
        const { isAdmin } = (0, getRoleStatus_1.default)(role);
        let isAuthorized = false;
        if (isAdmin || userId === leaderId || userId === coLeaderId) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateDivision(user, department, division) {
        const { id: userId, role } = user;
        const { isAdmin } = (0, getRoleStatus_1.default)(role);
        let isAuthorized = false;
        if (isAdmin ||
            userId === department.leaderId ||
            userId === department.coLeaderId ||
            userId === division.leaderId ||
            userId === division.coLeaderId) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateDivisionLeaderId(user, department) {
        const { id: userId, role } = user;
        const { isAdmin } = (0, getRoleStatus_1.default)(role);
        let isAuthorized = false;
        if (isAdmin ||
            userId === department.leaderId ||
            userId === department.coLeaderId) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateDivisionCoLeaderId(user, department) {
        this.authorizeUpdateDivisionLeaderId(user, department);
    }
    authorizeDeleteDivision(user, department) {
        const { id: userId, role } = user;
        const { isAdmin } = (0, getRoleStatus_1.default)(role);
        let isAuthorized = false;
        if (isAdmin ||
            userId === department.leaderId ||
            userId === department.coLeaderId) {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
};
DepartmentDivisionAuthorization = __decorate([
    (0, inversify_1.injectable)()
], DepartmentDivisionAuthorization);
exports.default = DepartmentDivisionAuthorization;
