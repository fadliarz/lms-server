"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testIsolation = {
    BaseAuthorization: {
        collectCoverageFrom: [`<rootDir>/src/common/class/BaseAuthorization.ts`],
        testMatch: [`<rootDir>/src/common/class/BaseAuthorization.test.ts`],
    },
    course: {
        collectCoverageFrom: [`<rootDir>/src/modules/course/**/*.ts`],
        testMatch: [`<rootDir>/src/modules/course/**/*.test.ts`],
    },
    courseController: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/course/controller/course.controller.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/course/controller/course.controller.test.ts`,
        ],
    },
    courseService: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/course/service/course.service.ts`,
        ],
        testMatch: [`<rootDir>/src/modules/course/service/course.service.test.ts`],
    },
    courseRepository: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/course/repository/course.repository.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/course/repository/course.repository.test.ts`,
        ],
    },
    courseAuthorization: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/course/authorization/course.authorization.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/course/authorization/course.authorization.test.ts`,
        ],
    },
    videoController: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/video/controller/video.controller.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/video/controller/video.controller.test.ts`,
        ],
    },
    videoService: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/video/service/video.service.ts`,
        ],
        testMatch: [`<rootDir>/src/modules/video/service/video.service.test.ts`],
    },
    videoRepository: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/video/repository/video.repository.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/video/repository/video.repository.test.ts`,
        ],
    },
    videoAuthorization: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/video/authorization/video.authorization.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/video/authorization/video.authorization.test.ts`,
        ],
    },
    enrollmentRepository: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/enrollment/repository/enrollment.repository.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/enrollment/repository/enrollment.repository.test.ts`,
        ],
    },
    enrollmentAuthorization: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/enrollment/authorization/enrollment.authorization.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/enrollment/authorization/enrollment.authorization.test.ts`,
        ],
    },
    courseLesson: {
        collectCoverageFrom: [`<rootDir>/src/modules/lesson/**/*.ts`],
        testMatch: [`<rootDir>/src/modules/lesson/**/*.test.ts`],
    },
    courseLessonController: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/lesson/controller/lesson.controller.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/lesson/controller/lesson.controller.test.ts`,
        ],
    },
    courseLessonService: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/lesson/service/lesson.service.ts`,
        ],
        testMatch: [`<rootDir>/src/modules/lesson/service/lesson.service.test.ts`],
    },
    courseLessonRepository: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/lesson/repository/lesson.repository.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/lesson/repository/lesson.repository.test.ts`,
        ],
    },
    courseLessonAuthorization: {
        collectCoverageFrom: [
            `<rootDir>/src/modules/lesson/authorization/lesson.authorization.ts`,
        ],
        testMatch: [
            `<rootDir>/src/modules/lesson/authorization/lesson.authorization.test.ts`,
        ],
    },
    getValuable: {
        collectCoverageFrom: [`<rootDir>/src/common/functions/getValuable.ts`],
        testMatch: [`<rootDir>/src/common/functions/getValuable.test.ts`],
    },
    processQuery: {
        collectCoverageFrom: [`<rootDir>/src/common/functions/processQuery.ts`],
        testMatch: [`<rootDir>/src/common/functions/processQuery.test.ts`],
    },
    processBoolean: {
        collectCoverageFrom: [`<rootDir>/src/common/functions/processBoolean.ts`],
        testMatch: [`<rootDir>/src/common/functions/processBoolean.test.ts`],
    },
    filterUserObject: {
        collectCoverageFrom: [`<rootDir>/src/common/functions/filterUserObject.ts`],
        testMatch: [`<rootDir>/src/common/functions/filterUserObject.test.ts`],
    },
};
const config = Object.assign({ preset: "ts-jest", testEnvironment: "node", verbose: true, collectCoverage: true, coverageDirectory: "<rootDir>/coverage" }, testIsolation.filterUserObject);
exports.default = config;
