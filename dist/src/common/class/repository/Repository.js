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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const user_type_1 = require("../../../modules/user/user.type");
const course_type_1 = require("../../../modules/course/course.type");
const enrollment_type_1 = require("../../../modules/enrollment/enrollment.type");
const category_type_1 = require("../../../modules/category/category.type");
const lesson_type_1 = require("../../../modules/lesson/lesson.type");
const video_type_1 = require("../../../modules/video/video.type");
const class_type_1 = require("../../../modules/class/class.type");
const assignment_type_1 = require("../../../modules/assignment/assignment.type");
const department_type_1 = require("../../../modules/department/department.type");
const division_type_1 = require("../../../modules/division/division.type");
const assignment_type_2 = require("../../../modules/personal-assignment/assignment.type");
const report_type_1 = require("../../../modules/report/report.type");
const completion_type_1 = require("../../../modules/assignment-completion/completion.type");
const program_type_1 = require("../../../modules/program/program.type");
const product_type_1 = require("../../../modules/product/product.type");
const variant_type_1 = require("../../../modules/product-variant/variant.type");
const order_type_1 = require("../../../modules/order/order.type");
let Repository = class Repository {
};
__decorate([
    (0, inversify_1.inject)(user_type_1.UserDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "user", void 0);
__decorate([
    (0, inversify_1.inject)(report_type_1.ReportDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "report", void 0);
__decorate([
    (0, inversify_1.inject)(assignment_type_2.PersonalAssignmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "personalAssignment", void 0);
__decorate([
    (0, inversify_1.inject)(category_type_1.CourseCategoryDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseCategory", void 0);
__decorate([
    (0, inversify_1.inject)(enrollment_type_1.CourseEnrollmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseEnrollment", void 0);
__decorate([
    (0, inversify_1.inject)(course_type_1.CourseDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "course", void 0);
__decorate([
    (0, inversify_1.inject)(lesson_type_1.CourseLessonDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseLesson", void 0);
__decorate([
    (0, inversify_1.inject)(video_type_1.CourseLessonVideoDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseLessonVideo", void 0);
__decorate([
    (0, inversify_1.inject)(class_type_1.CourseClassDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseClass", void 0);
__decorate([
    (0, inversify_1.inject)(assignment_type_1.CourseClassAssignmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseClassAssignment", void 0);
__decorate([
    (0, inversify_1.inject)(completion_type_1.CourseClassAssignmentCompletionDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "courseClassAssignmentCompletion", void 0);
__decorate([
    (0, inversify_1.inject)(department_type_1.DepartmentDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "department", void 0);
__decorate([
    (0, inversify_1.inject)(program_type_1.DepartmentProgramDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "departmentProgram", void 0);
__decorate([
    (0, inversify_1.inject)(division_type_1.DepartmentDivisionDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "departmentDivision", void 0);
__decorate([
    (0, inversify_1.inject)(product_type_1.ProductDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "product", void 0);
__decorate([
    (0, inversify_1.inject)(variant_type_1.ProductVariantDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "productVariant", void 0);
__decorate([
    (0, inversify_1.inject)(order_type_1.OrderDITypes.REPOSITORY),
    __metadata("design:type", Object)
], Repository.prototype, "order", void 0);
Repository = __decorate([
    (0, inversify_1.injectable)()
], Repository);
exports.default = Repository;
