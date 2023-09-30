export type TCommonQuery = {
  [key: string]: unknown;
} & {
  limit?: number;
  page?: number;

  count?: boolean;
  saved?: boolean;

  sort_field?: string;
  sort?: 1 | -1;
};
