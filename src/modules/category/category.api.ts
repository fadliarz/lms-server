import { CourseCategoryModel } from "./category.type";

export namespace $CourseCategoryAPI {
  const root = "/categories";
  const category = root + "/:categoryId";

  export namespace CreateCategory {
    export const endpoint = root;
    export const generateUrl = () => root;
    export type Dto = {
      title: string;
    };
    export type Response = {
      data: CourseCategoryModel;
    };
  }

  export namespace GetCategories {
    export const endpoint = root;
    export const generateUrl = () => root;
    export type Response = {
      data: CourseCategoryModel[];
    };
  }

  export namespace GetCategoryById {
    export const endpoint = category;
    export const generateUrl = (categoryId: number) =>
      `/categories/${categoryId}`;
    export type Response = {
      data: CourseCategoryModel;
    };
  }

  export namespace UpdateCategory {
    export const endpoint = category;
    export const generateUrl = (categoryId: number) =>
      `/categories/${categoryId}`;
    export type Dto = {
      title?: string;
    };
    export type Response = {
      data: CourseCategoryModel;
    };
  }

  export namespace DeleteCategory {
    export const endpoint = category;
    export const generateUrl = (categoryId: number) =>
      `/categories/${categoryId}`;
    export type Response = {
      data: { id: number };
    };
  }
}
