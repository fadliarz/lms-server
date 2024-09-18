export interface GenericObject<K> {
  [key: string]: K;
}

export type PagingQuery = {
  pageSize?: number;
  pageNumber?: number;
};

export type MakePropertiesOptional<T extends object, K extends keyof T> = Omit<
  T,
  K
> &
  Partial<Pick<T, K>>;

export type Valuable<T> = {
  [K in keyof T as T[K] extends null | undefined ? never : K]: T[K];
};

export type PickNullable<T> = {
  [P in keyof T as null extends T[P] ? P : never]: T[P];
};

export type PickNotNullable<T> = {
  [P in keyof T as null extends T[P] ? never : P]: T[P];
};

export type ElementTypeOfArray<T extends readonly any[]> =
  T extends readonly (infer U)[] ? U : never;

export type StrictPropertiesHelper<K extends keyof any> = {
  [P in K]: never;
};

export type StrictProperties<T, U extends T = T> = U &
  StrictPropertiesHelper<Exclude<keyof U, keyof T>>;

export type ModifyFieldWithNullToBeOptionalAndRemoveNull<T> = {
  [K in keyof PickNullable<T>]?: Exclude<T[K], null>;
} & {
  [K in keyof PickNotNullable<T>]: T[K];
};

export type Exact<T, U extends T> = {
  [Key in keyof U]: Key extends keyof T
    ? U[Key] extends object
      ? Exact<T[Key], U[Key]>
      : U[Key]
    : never;
};

export type JsonValue =
  | string
  | number
  | boolean
  | JsonObject
  | JsonArray
  | null;

export type JsonObject = {
  [Key in string]?: JsonValue;
};

export interface JsonArray extends Array<JsonValue> {}

export const AssignmentCompletionStatusModel = {
  NOT_STARTED: "NOT_STARTED",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export type AssignmentCompletionStatusModel =
  (typeof AssignmentCompletionStatusModel)[keyof typeof AssignmentCompletionStatusModel];

export const AssignmentTaskTypeModel = {
  PERSONAL_TASK: "PERSONAL_TASK",
  GROUP_TASK: "GROUP_TASK",
} as const;

export type AssignmentTaskTypeModel =
  (typeof AssignmentTaskTypeModel)[keyof typeof AssignmentTaskTypeModel];

export const ScholarshipFundingModel = {
  PARTIALLY_FUNDED: "PARTIALLY_FUNDED",
  FULLY_FUNDED: "FULLY_FUNDED",
} as const;

export type ScholarshipFundingModel =
  (typeof ScholarshipFundingModel)[keyof typeof ScholarshipFundingModel];
