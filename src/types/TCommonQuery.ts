export type TCommonQuery = {
  [key: string]: unknown;
} & {
  limit?: number;
  page?: number;

  count?: any;
  saved?: any;

  sort_field?: string;
  sort?: 1 | -1;

  kw?: string;
};
export type TCreateBody<T> = Omit<T, "_id" | "updatedAt" | "createdAt">;
