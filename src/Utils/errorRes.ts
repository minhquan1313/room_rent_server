import logger from "@/Utils/logger";
import { errorResponseCode } from "@/constants/errorResponseCode";
import { TErrorKey, TErrorResponse } from "@/types/TErrorResponse";
import { ValidationError } from "express-validator";

function isValidatorError(error: unknown) {
  // const test = {
  //   type: "field",
  //   value: "0889379139",
  //   msg: "Số điện thoại đã tồn tại",
  //   path: "tell",
  //   // location: "body",
  // };

  const requiredKeys = ["type", "value", "msg", "path", "location"];

  if (typeof error !== "object" || error === null) return false;

  return requiredKeys.every((key) => Object.hasOwn(error, key));
}
function validatorErrorToCode(error: unknown) {
  const { msg } = error as ValidationError;

  if (typeof msg !== "string") return undefined;

  if (!Object.hasOwn(errorResponseCode, msg)) return undefined;

  // const code = errorResponseCode[msg as never] as string | undefined;

  return msg as TErrorKey;
}

const errorDetectors: {
  detector: (error: unknown) => boolean;
  convertor: (error: unknown) => TErrorKey | undefined;
}[] = [
  {
    detector: isValidatorError,
    convertor: validatorErrorToCode,
  },
];

export function errorResponse(codes: TErrorKey | TErrorKey[], customMsg?: unknown): TErrorResponse {
  let newCodes: TErrorKey[];

  if (!Array.isArray(codes)) newCodes = [codes];
  else newCodes = codes;

  logger(`🚀 ~ file: errorRes.ts:16 ~ errorResponse ~ customMsg:`, customMsg);
  let customMsgCodesDetected = false;
  // uncaught
  if (Array.isArray(customMsg)) {
    (customMsg as unknown[]).forEach((msg) => {
      logger(`🚀 ~ customMsg.forEach ~ msg:`, msg);

      let code: TErrorKey | undefined;

      const detector = errorDetectors.find((instance) => instance.detector(msg));
      if (!detector) return;

      code = detector.convertor(msg as ValidationError);
      if (!code) return;

      newCodes.push(code);
    });
  }

  if (customMsgCodesDetected) {
    newCodes = newCodes.filter((code) => code !== "500");
  }

  const results: TErrorResponse = newCodes.map((code) => ({
    code,
    error: errorResponseCode[code],
  }));

  if (customMsg && !customMsgCodesDetected) results[0].customMsg = customMsg;

  return results;
}
