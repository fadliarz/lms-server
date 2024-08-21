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
      data: {};
    };
  }
}

export const CourseCategoryDITypes = {
  REPOSITORY: Symbol.for("COURSE_CATEGORY_REPOSITORY"),
  SERVICE: Symbol.for("COURSE_CATEGORY__SERVICE"),
  CONTROLLER: Symbol.for("COURSE_CATEGORY__CONTROLLER"),
  AUTHORIZATION: Symbol.for("COURSE_CATEGORY_AUTHORIZATION"),
};

export type CourseCategoryModel = {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};
