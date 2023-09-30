import { isRoleAdmin } from "@/Utils/roleType";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Email } from "@/models/User/Email";
import { User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import PhoneService from "@/services/PhoneService";
import { check } from "express-validator";

export const validateUpdateUser = () => {
  return [
    //
    check("username", "Tên người dùng không được đổi").not().exists(),

    // check("password", "Mật khẩu 6 kí tự trở lên").optional().isLength({ min: 6 }),
    check("password", "Mật khẩu cũ không khớp")
      .optional()
      .custom((_, { req }) => {
        const { roleTitle } = req as RequestAuthenticate;
        if (isRoleAdmin(roleTitle)) return true;

        console.log(`🚀 ~ .custom ~ "old_password" in req.body:`, "old_password" in req.body);

        if (req.body.old_password) {
          // if ("old_password" in req.body && req.body.old_password) {
          return true;
        }
        throw new Error("Thiếu mật khẩu cũ");
      })
      .custom(async (_, { req }) => {
        const { roleTitle, user } = req as RequestAuthenticate;
        if (isRoleAdmin(roleTitle)) return true;

        const { old_password } = req.body;

        if (!LoginTokenService.comparePassword(old_password, user?.password)) {
          throw new Error();
        }
      }),

    check("tell", "Số điện thoại đã tồn tại")
      .optional()
      .custom(async (value) => {
        if (value === "") return;
        const doc = await PhoneService.findOne(value);
        if (doc) throw new Error();
      }),

    check("tell", "Số điện thoại không hợp lệ")
      .optional()
      .if(check("region_code").exists())
      .custom(async (value, { req }) => {
        if (value === "") return;

        const valid = PhoneService.isValid(req.body.tell, req.body.region_code);
        console.log(`🚀 ~ .custom ~ req.body.tell:`, req.body.tell, req.body.region_code);

        console.log(`🚀 ~ .custom ~ valid:`, valid);

        if (!valid) throw new Error();
      }),

    check("email", "Email không hợp lệ").optional().isEmail(),
    check("email", "Email đã tồn tại")
      .optional()
      .custom(async (email) => {
        const doc = await Email.findOne({ email });
        if (doc) throw new Error();
      }),
  ];
};

export const validateLoginUser = () => {
  return [
    check("username", "Tên người dùng không được trống").not().isEmpty(),
    check("username", "Tên người dùng không chứa khoảng trắng").not().contains(" "),

    check("password", "Mật khẩu không được trống").not().isEmpty(),
  ];
};

export const validateRegisterUser = () => {
  return [
    check("username", "Tên người dùng không được trống").not().isEmpty(),
    // check("username", "Tên người dùng từ 6 kí tự trở lên").isLength({ min: 6 }),
    check("username", "Tên người dùng không chứa khoảng trắng").not().contains(" "),
    check("username", "Tên người dùng đã tồn tại")
      //
      .custom(async (value, { req }) => {
        const doc = await User.findOne({ username: req.body.username });
        if (doc) throw new Error();
      }),

    check("password", "Mật khẩu không được trống").not().isEmpty(),
    // check("password", "Mật khẩu 6 kí tự trở lên").isLength({ min: 6 }),

    check("first_name", "Tên không được để trống").not().isEmpty(),

    check("tell", "Số điện thoại không được trống").not().isEmpty(),
    check("tell", "Số điện thoại đã tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await PhoneService.findOne(req.body.tell);
        if (doc) throw new Error();
      }),

    check("region_code", "Thiếu mã vùng").not().isEmpty(),
    check("tell", "Số điện thoại không hợp lệ")
      .optional()
      .if(check("region_code").exists())
      .custom(async (value, { req }) => {
        const valid = PhoneService.isValid(req.body.tell, req.body.region_code);
        if (!valid) throw new Error();
      }),

    check("email", "Email không hợp lệ").optional().isEmail(),
    check("email", "Email đã tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await Email.findOne({ email: req.body.email });
        if (doc) throw new Error();
      }),
  ];
};
