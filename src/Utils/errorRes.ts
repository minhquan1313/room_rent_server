import { jsonResponse } from "@/types/jsonResponseError";

export function errorResponse(msg: any[] | any = [""], code = -1): jsonResponse {
  return {
    code,
    error: Array.isArray(msg) ? msg : [msg],
    success: false,
  };
}
