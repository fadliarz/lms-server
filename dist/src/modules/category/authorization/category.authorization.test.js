"use strict";
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
const course_type_1 = require("../../course/course.type");
const AuthorizationException_1 = __importDefault(require("../../../common/class/exceptions/AuthorizationException"));
const category_authorization_1 = __importDefault(require("./category.authorization"));
describe("Category Test Suite", () => {
    let authorization;
    /**
     * Create
     *
     */
    describe("CreateCategory Authorization", () => {
        beforeEach(() => {
            authorization = new category_authorization_1.default();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        function getAuthorizedTestCase(userRole) {
            return {
                name: (userRole) => {
                    return `Authorized: [userRole: ${userRole}]`;
                },
                getRole: () => {
                    return { userRole };
                },
                test: (params) => __awaiter(this, void 0, void 0, function* () {
                    const { userRole } = params;
                    const userId = 1;
                    expect(() => {
                        authorization.authorizeCreateCategory({
                            id: userId,
                            role: userRole,
                        });
                    }).not.toThrow();
                }),
            };
        }
        function getUnauthorizedTestCase(userRole) {
            return {
                name: (userRole) => {
                    return `Unauthorized: [userRole: ${userRole}]`;
                },
                getRole: () => {
                    return { userRole };
                },
                test: (params) => __awaiter(this, void 0, void 0, function* () {
                    const { userRole } = params;
                    const userId = 1;
                    expect(() => {
                        authorization.authorizeCreateCategory({
                            id: userId,
                            role: userRole,
                        });
                    }).toThrow(AuthorizationException_1.default);
                }),
            };
        }
        const testCases = [
            getUnauthorizedTestCase(course_type_1.UserRoleModel.STUDENT),
            getAuthorizedTestCase(course_type_1.UserRoleModel.INSTRUCTOR),
            getAuthorizedTestCase(course_type_1.UserRoleModel.OWNER),
        ];
        testCases.forEach((tc) => {
            const { userRole } = tc.getRole();
            return it(tc.name(userRole), () => __awaiter(void 0, void 0, void 0, function* () {
                yield tc.test({
                    userRole,
                });
            }));
        });
    });
    /**
     * Update
     *
     */
    describe("UpdateCategory Authorization", () => {
        beforeEach(() => {
            authorization = new category_authorization_1.default();
        });
        afterEach(() => {
            jest.resetAllMocks();
        });
        function getAuthorizedTestCase(userRole) {
            return {
                name: (userRole) => {
                    return `Authorized: [userRole: ${userRole}]`;
                },
                getRole: () => {
                    return { userRole };
                },
                test: (params) => __awaiter(this, void 0, void 0, function* () {
                    const { userRole } = params;
                    const userId = 1;
                    expect(() => {
                        authorization.authorizeUpdateCategory({
                            id: userId,
                            role: userRole,
                        });
                    }).not.toThrow();
                }),
            };
        }
        function getUnauthorizedTestCase(userRole) {
            return {
                name: (userRole) => {
                    return `Unauthorized: [userRole: ${userRole}]`;
                },
                getRole: () => {
                    return { userRole };
                },
                test: (params) => __awaiter(this, void 0, void 0, function* () {
                    const { userRole } = params;
                    const userId = 1;
                    expect(() => {
                        authorization.authorizeUpdateCategory({
                            id: userId,
                            role: userRole,
                        });
                    }).toThrow(AuthorizationException_1.default);
                }),
            };
        }
        const testCases = [
            getUnauthorizedTestCase(course_type_1.UserRoleModel.STUDENT),
            getAuthorizedTestCase(course_type_1.UserRoleModel.INSTRUCTOR),
            getAuthorizedTestCase(course_type_1.UserRoleModel.OWNER),
        ];
        testCases.forEach((tc) => {
            const { userRole } = tc.getRole();
            return it(tc.name(userRole), () => __awaiter(void 0, void 0, void 0, function* () {
                yield tc.test({
                    userRole,
                });
            }));
        });
    });
});
