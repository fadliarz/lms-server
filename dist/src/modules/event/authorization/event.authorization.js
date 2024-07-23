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
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const getRoleStatus_1 = __importDefault(require("../../../common/functions/getRoleStatus"));
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
let EventAuthorization = class EventAuthorization extends BaseAuthorization_1.default {
    authorizeCreateEvent(user) {
        const { id: userId, role: userRole } = user;
        const { isAdmin, isInstructor, isStudent } = (0, getRoleStatus_1.default)(userRole);
        let isAuthorized = false;
        if (isStudent) {
        }
        if (isInstructor || isAdmin) {
            true;
        }
        if (!isAuthorized) {
            throw new AuthorizationException_1.default();
        }
    }
    authorizeUpdateEvent(user) {
        this.authorizeCreateEvent(user);
    }
    authorizeDeleteEvent(user) {
        this.authorizeCreateEvent(user);
    }
};
EventAuthorization = __decorate([
    (0, inversify_1.injectable)()
], EventAuthorization);
exports.default = EventAuthorization;
