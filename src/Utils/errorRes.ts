import { jsonResponse } from "@/types/jsonResponseError";

export function errorResponse(msg: any[] = [""], code = -1): jsonResponse {
  return {
    code,
    error: msg,
    success: false,
  };
}
