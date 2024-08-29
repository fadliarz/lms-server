import "reflect-metadata";
import { IRepository } from "./repository.type";
import { inject, injectable } from "inversify";
import { UserDITypes } from "../../../modules/user/user.type";
import { CourseDITypes } from "../../../modules/course/course.type";
import { CourseEnrollmentDITypes } from "../../../modules/enrollment/enrollment.type";
import { CourseCategoryDITypes } from "../../../modules/category/category.type";
import { CourseLessonDITypes } from "../../../modules/lesson/lesson.type";
import { CourseLessonVideoDITypes } from "../../../modules/video/video.type";
import { CourseClassDITypes } from "../../../modules/class/class.type";
import { CourseClassAssignmentDITypes } from "../../../modules/assignment/assignment.type";
import { ICourseClassAssignmentRepository } from "../../../modules/assignment/assignment.interface";
import { ICourseCategoryRepository } from "../../../modules/category/category.interface";
import { ICourseRepository } from "../../../modules/course/course.interface";
import { ICourseClassRepository } from "../../../modules/class/class.interface";
import { ICourseEnrollmentRepository } from "../../../modules/enrollment/enrollment.interface";
import { ICourseLessonRepository } from "../../../modules/lesson/lesson.interface";
import { IUserRepository } from "../../../modules/user/user.interface";
import { ICourseLessonVideoRepository } from "../../../modules/video/video.interface";
import { DepartmentDITypes } from "../../../modules/department/department.type";
import { IDepartmentRepository } from "../../../modules/department/department.interface";
import { DepartmentDivisionDITypes } from "../../../modules/division/division.type";
import { IDepartmentDivisionRepository } from "../../../modules/division/division.interface";
import { PersonalAssignmentDITypes } from "../../../modules/personal-assignment/assignment.type";
import { IPersonalAssignmentRepository } from "../../../modules/personal-assignment/assignment.interface";
import { ReportDITypes } from "../../../modules/report/report.type";
import { IReportRepository } from "../../../modules/report/report.interface";
import { CourseClassAssignmentCompletionDITypes } from "../../../modules/assignment-completion/completion.type";
import { ICourseClassAssignmentCompletionRepository } from "../../../modules/assignment-completion/completion.interface";
import { DepartmentProgramDITypes } from "../../../modules/program/program.type";
import { IDepartmentProgramRepository } from "../../../modules/program/program.interface";
import { ProductDITypes } from "../../../modules/product/product.type";
import { IProductRepository } from "../../../modules/product/product.interface";
import { ProductVariantDITypes } from "../../../modules/product-variant/variant.type";
import { IProductVariantRepository } from "../../../modules/product-variant/variant.interface";
import { OrderDITypes } from "../../../modules/order/order.type";
import { IOrderRepository } from "../../../modules/order/order.interface";

@injectable()
export default class Repository implements IRepository {
  @inject(UserDITypes.REPOSITORY)
  public readonly user: IUserRepository;

  @inject(ReportDITypes.REPOSITORY)
  public readonly report: IReportRepository;

  @inject(PersonalAssignmentDITypes.REPOSITORY)
  public readonly personalAssignment: IPersonalAssignmentRepository;

  @inject(CourseCategoryDITypes.REPOSITORY)
  public readonly courseCategory: ICourseCategoryRepository;

  @inject(CourseEnrollmentDITypes.REPOSITORY)
  public readonly courseEnrollment: ICourseEnrollmentRepository;

  @inject(CourseDITypes.REPOSITORY)
  public readonly course: ICourseRepository;

  @inject(CourseLessonDITypes.REPOSITORY)
  public readonly courseLesson: ICourseLessonRepository;

  @inject(CourseLessonVideoDITypes.REPOSITORY)
  public readonly courseLessonVideo: ICourseLessonVideoRepository;

  @inject(CourseClassDITypes.REPOSITORY)
  public readonly courseClass: ICourseClassRepository;

  @inject(CourseClassAssignmentDITypes.REPOSITORY)
  public readonly courseClassAssignment: ICourseClassAssignmentRepository;

  @inject(CourseClassAssignmentCompletionDITypes.REPOSITORY)
  public readonly courseClassAssignmentCompletion: ICourseClassAssignmentCompletionRepository;

  @inject(DepartmentDITypes.REPOSITORY)
  public readonly department: IDepartmentRepository;

  @inject(DepartmentProgramDITypes.REPOSITORY)
  public readonly departmentProgram: IDepartmentProgramRepository;

  @inject(DepartmentDivisionDITypes.REPOSITORY)
  public readonly departmentDivision: IDepartmentDivisionRepository;

  @inject(ProductDITypes.REPOSITORY)
  public readonly product: IProductRepository;

  @inject(ProductVariantDITypes.REPOSITORY)
  public readonly productVariant: IProductVariantRepository;

  @inject(OrderDITypes.REPOSITORY)
  public readonly order: IOrderRepository;
}
