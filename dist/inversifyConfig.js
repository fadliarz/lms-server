"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const user_controller_1 = require("./modules/user/controller/user.controller");
const user_repository_1 = require("./modules/user/repository/user.repository");
const user_service_1 = require("./modules/user/service/user.service");
const user_type_1 = require("./modules/user/user.type");
const course_type_1 = require("./modules/course/course.type");
const course_repository_1 = require("./modules/course/repository/course.repository");
const course_service_1 = require("./modules/course/service/course.service");
const course_controller_1 = require("./modules/course/controller/course.controller");
const dIContainer = new inversify_1.Container();
/**
 * User Container
 */
dIContainer.bind(user_type_1.UserDITypes.USER_REPOSITORY).to(user_repository_1.UserRepository);
dIContainer.bind(user_type_1.UserDITypes.USER_SERVICE).to(user_service_1.UserService);
dIContainer.bind(user_type_1.UserDITypes.USER_CONTROLLER).to(user_controller_1.UserController);
/**
 * Course Container
 */
dIContainer
    .bind(course_type_1.CourseDITypes.COURSE_REPOSITORY)
    .to(course_repository_1.CourseRepository);
dIContainer.bind(course_type_1.CourseDITypes.COURSE_SERVICE).to(course_service_1.CourseService);
dIContainer
    .bind(course_type_1.CourseDITypes.COURSE_CONTROLLER)
    .to(course_controller_1.CourseController);
exports.default = dIContainer;
