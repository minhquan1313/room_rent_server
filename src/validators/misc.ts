import { Email } from "@/models/User/Email";
import JWTService from "@/services/JWTService";
import { check } from "express-validator";

export const validateVerifyEmail = () => {
  return [
    //
    check("token", "Thiếu token").notEmpty(),
    check("token").custom((value) => {
      try {
        const token = JWTService.verify(value);
        console.log(`🚀 ~ check ~ token:`, token);

        if (token) {
          return true;
        } else {
          throw new Error();
        }
      } catch (error) {
        console.log(`🚀 ~ check ~ error:`, error);

        if (String(error).includes("jwt expired")) throw new Error(`Mã hết hạn`);
        if (String(error).includes("invalid")) throw new Error(`Mã không hợp lệ`);
        throw new Error(`Có lỗi khi xác thực token`);
      }
    }),
  ];
};
export const validateMakeVerifyEmail = () => {
  const { EMAIL_ADDRESS } = process.env;
  if (!EMAIL_ADDRESS) throw new Error(`Missing EMAIL_ADDRESS`);

  return [
    //
    check("email", "Thiếu email").notEmpty(),
    check("email", "Email cấm").not().equals(EMAIL_ADDRESS),
    check("email", "Email không hợp lệ").isEmail(),
    check("email", "Email không tồn tại").custom(async (email) => {
      if (await Email.findOne({ email })) return;
      throw new Error();
    }),
  ];
};
