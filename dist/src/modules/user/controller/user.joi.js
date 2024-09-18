"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignIn = exports.UpdateUserRoleDtoJoi = exports.UpdateUserPasswordDtoJoi = exports.UpdateUserEmailDtoJoi = exports.UpdateBasicUserDtoJoi = exports.GetUserManagedCoursesQueryJoi = exports.GetUserEnrolledCoursesQueryJoi = exports.GetPublicUsersQueryJoi = exports.CreateUserDtoJoi = void 0;
const joi_1 = __importDefault(require("joi"));
const getUserRoleArray_1 = __importDefault(require("../../../common/functions/getUserRoleArray"));
exports.CreateUserDtoJoi = joi_1.default.object({
    /**
     * Required
     *
     */
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    name: joi_1.default.string().required(),
    NIM: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.date().required(),
    address: joi_1.default.string().required(),
    bloodType: joi_1.default.string().required(),
    medicalHistories: joi_1.default.array().items(joi_1.default.string()),
    UKM: joi_1.default.array().items(joi_1.default.string()),
    hobbies: joi_1.default.array().items(joi_1.default.string()),
    lineId: joi_1.default.string().required(),
    emergencyNumber: joi_1.default.string().required(),
    /**
     * Optional
     *
     */
    avatar: joi_1.default.string(),
    about: joi_1.default.string(),
});
exports.GetPublicUsersQueryJoi = joi_1.default.object({
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
/**
 * User
 *
 */
exports.GetUserEnrolledCoursesQueryJoi = joi_1.default.object({
    category_id: joi_1.default.array().items(joi_1.default.number()),
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.GetUserManagedCoursesQueryJoi = joi_1.default.object({
    category_id: joi_1.default.array().items(joi_1.default.number()),
    pageSize: joi_1.default.number(),
    pageNumber: joi_1.default.number(),
});
exports.UpdateBasicUserDtoJoi = joi_1.default.object({
    phoneNumber: joi_1.default.string(),
    name: joi_1.default.string(),
    NIM: joi_1.default.string(),
    avatar: joi_1.default.string(),
    about: joi_1.default.string(),
    dateOfBirth: joi_1.default.date(),
    address: joi_1.default.string(),
    bloodType: joi_1.default.string(),
    medicalHistories: joi_1.default.array().items(joi_1.default.string()),
    UKM: joi_1.default.array().items(joi_1.default.string()),
    hobbies: joi_1.default.array().items(joi_1.default.string()),
    lineId: joi_1.default.string(),
    emergencyNumber: joi_1.default.string(),
});
exports.UpdateUserEmailDtoJoi = joi_1.default.object({
    email: joi_1.default.string().email().required(),
});
exports.UpdateUserPasswordDtoJoi = joi_1.default.object({
    password: joi_1.default.string().required(),
});
exports.UpdateUserRoleDtoJoi = joi_1.default.object({
    role: joi_1.default.string()
        .valid(...(0, getUserRoleArray_1.default)().map((role) => role.toString()))
        .required(),
});
exports.SignIn = joi_1.default.object({
    email: joi_1.default.string().email().required(),
    password: joi_1.default.string().required(),
});
