import { jsonResponseError } from "@/types/jsonResponseError";

export function errorResponse(msg: string): jsonResponseError {
  return {
    message: msg,
    failed: true,
  };
}
