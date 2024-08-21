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
const inversify_1 = require("inversify");
const RecordNotFoundException_1 = __importDefault(require("../../../common/class/exceptions/RecordNotFoundException"));
const BaseRepository_1 = __importDefault(require("../../../common/class/BaseRepository"));
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
                            { authorId: id.userId },
                        ],
                    },
                },
            });
            const allUpcoming = [...events, ...schedules];
            allUpcoming.sort((a, b) => b.date.getTime() - a.date.getTime());
            return allUpcoming;
        });
    }
    getUserEnrolledCourses(id, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollments = yield this.db.courseEnrollment.findMany({
                where: { userId: id.userId, role: where.role },
                select: {
                    course: true,
                },
            });
            const courses = [];
            for (const enrollment of enrollments) {
                courses.push(enrollment.course);
            }
            return courses;
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
                                    privileges: {
                                        privilege,
                                    },
                                },
                            },
                        },
                    ],
                },
            });
            if (!department) {
                return false;
            }
            return true;
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
