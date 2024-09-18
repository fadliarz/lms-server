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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const user_type_1 = require("../user.type");
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
const order_api_1 = require("../../order/order.api");
let UserRepository = class UserRepository extends BaseRepository_1.default {
    constructor() {
        super();
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.create({
                data,
            });
        });
    }
    createUserAndBlankReport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            return this.db.user.create({
                data: Object.assign(Object.assign({}, data), { report: {
                        create: {},
                    } }),
            });
        });
    }
    getPublicUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const select = { id: true, NIM: true, name: true, avatar: true };
            if (query && query.pageSize && !query.pageNumber) {
                return this.db.user.findMany({ take: query.pageSize, select });
            }
            if (query && query.pageSize && query.pageNumber) {
                return this.db.user.findMany({
                    take: query.pageSize,
                    skip: (query.pageNumber - 1) * query.pageSize,
                    select,
                });
            }
            return this.db.user.findMany({ select });
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findUnique({
                where: {
                    id: id.userId,
                },
            });
        });
    }
    getUserByIdOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUserById(id);
            if (!user) {
                throw error || new RecordNotFoundException_1.default();
            }
            return user;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findUnique({ where: { email } });
        });
    }
    getUserByAccessToken(accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findFirst({
                where: {
                    accessToken,
                },
            });
        });
    }
    getUserByRefreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.findFirst({
                where: {
                    refreshToken: {
                        has: refreshToken,
                    },
                },
            });
        });
    }
    getUserPermissions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const permissions = {
                course: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.COURSE),
                scholarship: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.SCHOLARSHIP),
                program: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.PROGRAM),
                event: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.PROGRAM),
                competition: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.COMPETITION),
                report: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.REPORT),
                store: yield this.getUserAuthorizationStatusFromPrivilege(id, user_type_1.PrivilegeModel.STORE),
            };
            return permissions;
        });
    }
    getUserAssignments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const classAssignments = yield this.db.courseClassAssignment.findMany({
                where: {
                    courseClass: {
                        course: {
                            enrollments: {
                                some: {
                                    userId: id.userId,
                                },
                            },
                        },
                    },
                },
                include: {
                    courseClass: {
                        select: {
                            id: true,
                            title: true,
                            course: {
                                select: {
                                    id: true,
                                    title: true,
                                },
                            },
                        },
                    },
                    assignmentCompletions: {
                        where: {
                            userId: id.userId,
                        },
                    },
                },
            });
            const assignments = [];
            for (let theAssignment of classAssignments) {
                const { courseClass: theCourseClass, assignmentCompletions: theCompletions } = theAssignment, assignment = __rest(theAssignment, ["courseClass", "assignmentCompletions"]);
                const { course: theCourse } = theCourseClass, theClass = __rest(theCourseClass, ["course"]);
                assignments.push({
                    type: "course",
                    assignment: Object.assign(Object.assign({}, assignment), { class: theClass, course: theCourse, completion: theCompletions.length > 0 ? theCompletions[0] : null }),
                });
            }
            const personalAssignments = yield this.db.personalAssignment.findMany({
                where: id,
            });
            for (let theAssignment of personalAssignments) {
                assignments.push({
                    type: "personal",
                    assignment: theAssignment,
                });
            }
            assignments.sort((a, b) => b.assignment.deadline.getTime() - a.assignment.deadline.getTime());
            return assignments;
        });
    }
    getUserEventAndCourseSchedules(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const events = yield this.db.event.findMany();
            const schedules = yield this.db.courseSchedule.findMany({
                where: {
                    course: {
                        OR: [
                            {
                                enrollments: {
                                    some: {
                                        userId: id.userId,
                                    },
                                },
                            },
                        ],
                    },
                },
            });
            const allUpcoming = [...events, ...schedules];
            allUpcoming.sort((a, b) => b.date.getTime() - a.date.getTime());
            return allUpcoming;
        });
    }
    getUserEnrolledCourses(id, where, query) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield this.db.courseEnrollment.findMany(Object.assign({ where: Object.assign({ userId: id.userId, role: { in: where.role } }, (((_a = query === null || query === void 0 ? void 0 : query.category_id) === null || _a === void 0 ? void 0 : _a.length) > 0
                    ? { course: { category: { id: { in: query === null || query === void 0 ? void 0 : query.category_id } } } }
                    : {})), select: {
                    id: true,
                    course: true,
                } }, (query
                ? Object.assign({}, (query.pageNumber && query.pageSize
                    ? {
                        take: query.pageSize,
                        skip: (query.pageNumber - 1) * query.pageSize,
                    }
                    : {})) : {})));
            const courses = [];
            for (const enrollment of enrollments) {
                courses.push(Object.assign({ enrollment: { id: enrollment.id } }, enrollment.course));
            }
            return courses;
        });
    }
    getUserCourseEnrollmentStatusByCourseId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield this.db.courseEnrollment.findUnique({
                where: {
                    userId_courseId: id,
                },
                select: { id: true },
            });
            return {
                isEnrolled: !!enrollment,
            };
        });
    }
    getUserOneCourseEnrollmentId(id, where) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.courseEnrollment.findFirst({
                where: { userId: id.userId, role: where.role },
                select: { id: true },
            });
        });
    }
    getUserEnrolledDepartmentPrograms(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield this.db.departmentProgramEnrollment.findMany({
                where: {
                    userId: id.userId,
                },
                select: {
                    program: true,
                },
            });
            const programs = [];
            for (const enrollment of enrollments) {
                programs.push(enrollment.program);
            }
            programs.sort((a, b) => b.date.getTime() - a.date.getTime());
            return programs;
        });
    }
    getUserLedDepartments(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.department.findMany({
                where: {
                    OR: [{ leaderId: id.userId }, { coLeaderId: id.userId }],
                },
            });
        });
    }
    getUserLedDepartmentDivisions(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.departmentDivision.findMany({
                where: {
                    OR: [{ leaderId: id.userId }, { coLeaderId: id.userId }],
                },
                include: {
                    department: { select: { id: true, title: true } },
                },
            });
        });
    }
    getUserReportOrThrow(id, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const report = yield this.db.report.findUnique({
                where: id,
            });
            if (!report) {
                throw error || new RecordNotFoundException_1.default();
            }
            return report;
        });
    }
    getUserOrders(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return order_api_1.$OrderAPI.transformObject(yield this.db.order.findMany({
                where: id,
            }));
        });
    }
    getDepartmentProgramsWithEnrollmentInformation(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const programs = yield this.db.departmentProgram.findMany({
                where: {
                    departmentId: id.departmentId,
                },
                include: {
                    WorkProgramEnrollment: {
                        where: {
                            userId: id.userId,
                        },
                        take: 1,
                    },
                },
            });
            return programs.map((program) => {
                const { WorkProgramEnrollment } = program, restProgram = __rest(program, ["WorkProgramEnrollment"]);
                return Object.assign(Object.assign({}, restProgram), { isEnrolled: WorkProgramEnrollment.length > 0 });
            });
        });
    }
    getUserAuthorizationStatusFromPrivilege(id, privilege) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.db.department.findFirst({
                where: {
                    OR: [
                        { leaderId: id.userId },
                        { coLeaderId: id.userId },
                        {
                            divisions: {
                                some: {
                                    enrollments: {
                                        some: { userId: id.userId },
                                    },
                                    privileges: {
                                        privilege,
                                    },
                                },
                            },
                        },
                    ],
                },
            });
            return department !== null;
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.update({
                where: { id: id.userId },
                data,
            });
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.db.user.delete({
                where: { id: id.userId },
            });
        });
    }
};
UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
exports.default = UserRepository;
