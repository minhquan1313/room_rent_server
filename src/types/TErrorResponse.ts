import { errorResponseCode } from "@/constants/errorResponseCode";

export type TErrorKey = keyof typeof errorResponseCode;

export type TErrorResponse = {
  code: TErrorKey;
  error: string;
  customMsg?: unknown;
}[];
