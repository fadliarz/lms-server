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
const inversify_1 = require("inversify");
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
let PersonalAssignmentAuthorization = class PersonalAssignmentAuthorization extends BaseAuthorization_1.default {
    authorizeCreateAssignment(user, targetUserId) {
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
    }
    authorizeUpdateAssignment(user, assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { isStudent, isAdmin } = (0, getRoleStatus_1.default)(user.role);
            let isAuthorized = false;
            if (isStudent) {
                const assignment = yield this.globalRepository.personalAssignment.getAssignmentByIdOrThrow({
                    assignmentId,
                });
                if (user.id === assignment.userId) {
                    isAuthorized = true;
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
    authorizeDeleteAssignment(user, assignmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorizeUpdateAssignment(user, assignmentId);
        });
    }
};
PersonalAssignmentAuthorization = __decorate([
    (0, inversify_1.injectable)()
], PersonalAssignmentAuthorization);
exports.default = PersonalAssignmentAuthorization;
