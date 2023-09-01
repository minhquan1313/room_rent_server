import { jsonResponse } from "@/types/jsonResponseError";

export function errorResponse(msg: string | { msg: string }[] = [{ msg: "Not defined error" }], code = -1): jsonResponse {
  return {
    code,
    error: Array.isArray(msg) ? msg : [{ msg }],
    success: false,
  };
}
