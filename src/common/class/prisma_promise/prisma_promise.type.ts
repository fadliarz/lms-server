import { Course, Prisma } from "@prisma/client";
import { PrismaTransaction } from "../../types";

export const PrismaPromiseDITypes = {
  PRISMA_PROMISE: Symbol.for("PRISMA_PROMISE"),
  COURSE: Symbol.for("PRISMA_PROMISE_COURSE"),
};

export type CoursePromise = Prisma.Prisma__CourseClient<Course, never>;

export interface IPrismaPromise {
  course: ICoursePrismaPromise;
}

export interface ICoursePrismaPromise {
  incrementTotalStudents: (
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ) => CoursePromise;
  incrementTotalInstructors: (
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ) => CoursePromise;
  incrementTotalLessons: (
    tx: PrismaTransaction,
    courseId: number,
    increment: number,
  ) => CoursePromise;
}
