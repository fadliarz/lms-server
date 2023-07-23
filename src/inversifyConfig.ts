import { Container } from "inversify";
import { UserController } from "./modules/user/controller/user.controller";
import { UserRepository } from "./modules/user/repository/user.repository";
import { UserService } from "./modules/user/service/user.service";
import { IUserController } from "./modules/user/controller/user.controller";
import { IUserService } from "./modules/user/service/user.service";
import { IUserRepository } from "./modules/user/repository/user.repository";
import { UserDITypes } from "./modules/user/user.type";
import { ICourseController } from "./modules/course/controller/course.controller";
import { ICourseService } from "./modules/course/service/course.service";
import { ICourseRepository } from "./modules/course/repository/course.repository";
import { CourseDITypes } from "./modules/course/course.type";
import { CourseRepository } from "./modules/course/repository/course.repository";
import { CourseService } from "./modules/course/service/course.service";
import { CourseController } from "./modules/course/controller/course.controller";

const dIContainer = new Container();

/**
 * User Container
 */
dIContainer.bind<IUserRepository>(UserDITypes.USER_REPOSITORY).to(UserRepository);
dIContainer.bind<IUserService>(UserDITypes.USER_SERVICE).to(UserService);
dIContainer.bind<IUserController>(UserDITypes.USER_CONTROLLER).to(UserController);

/**
 * Course Container
 */
dIContainer
  .bind<ICourseRepository>(CourseDITypes.COURSE_REPOSITORY)
  .to(CourseRepository);
dIContainer.bind<ICourseService>(CourseDITypes.COURSE_SERVICE).to(CourseService);
dIContainer
  .bind<ICourseController>(CourseDITypes.COURSE_CONTROLLER)
  .to(CourseController);

export default dIContainer;
