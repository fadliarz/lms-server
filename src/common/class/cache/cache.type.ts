import { Course, CourseLessonVideo, User } from "@prisma/client";

export type StringifyFields<T> = {
  [K in keyof T]: string;
};

export interface ICache {
  user: IUserCache;
  course: ICourseCache;
  courseLesson: ICourseLessonCache;
}

export type CacheOptions = {
  exp?: number; // in second
  expInMs?: number; // in ms
  expAt?: number; // timestamp
};

export interface BasicCacheTemplate<
  T extends object,
  U = StringifyFields<Exclude<T, "id">>,
> {
  hSet: (key: string, entity: T, options?: CacheOptions) => number;
  hGetAlL: (key: string) => T;
  serialize: (entity: T) => U;
  deserialize: (storedEntity: U) => T;
}

export interface IUserCache extends BasicCacheTemplate<User> {}

export interface ICourseCache extends BasicCacheTemplate<Course> {}

export interface ICourseLessonCache
  extends BasicCacheTemplate<CourseLessonVideo> {}

export interface ICacheWrapper {
  hSet: <V extends Record<string, string | number>>(
    key: string,
    value: V,
    options?: CacheOptions,
    ...args: any
  ) => Promise<number>;
  hGetAll: <V extends Record<string, string | number>, S = StringifyFields<V>>(
    key: string,
    ...args: any
  ) => Promise<V>;
}
