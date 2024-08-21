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
const BaseAuthorization_1 = __importDefault(require("../../../common/class/BaseAuthorization"));
const assignment_type_1 = require("../../assignment/assignment.type");
let CourseScheduleAuthorization = class CourseScheduleAuthorization extends BaseAuthorization_1.default {
    authorizeCreateSchedule(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assignmentAuthorization.authorizeCreateAssignment(user, courseId);
        });
    }
    authorizeReadSchedule(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.assignmentAuthorization.authorizeReadAssignment(user, courseId);
        });
    }
    authorizeUpdateSchedule(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorizeCreateSchedule(user, courseId);
        });
    }
    authorizeDeleteSchedule(user, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authorizeCreateSchedule(user, courseId);
        });
    }
};
__decorate([
    (0, inversify_1.inject)(assignment_type_1.CourseClassAssignmentDITypes.AUTHORIZATION),
    __metadata("design:type", Object)
], CourseScheduleAuthorization.prototype, "assignmentAuthorization", void 0);
CourseScheduleAuthorization = __decorate([
    (0, inversify_1.injectable)()
], CourseScheduleAuthorization);
exports.default = CourseScheduleAuthorization;