import { isRoleAdmin, isRoleTopAdmin, roleOrder } from "@/Utils/roleType";
import { RequestAuthenticate } from "@/middlewares/AuthenticateMiddleware";
import { Email } from "@/models/User/Email";
import { Role } from "@/models/User/Role";
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
    check("role", "Vai trò không cho phép")
      .optional()
      .custom(async (v, { req }) => {
        const { roleTitle } = req as RequestAuthenticate;
        if (isRoleTopAdmin(roleTitle)) return true;

        /**
         * Người thực hiện thay đổi phải từ admin cấp 2 trở lên
         */
        if (!isRoleAdmin(roleTitle)) throw new Error();

        const role = await Role.findOne({ title: v });
        if (!role) throw new Error(`Vai trò không tồn tại`);

        /**
         * Nếu vai trò sắp bị thay đổi lớn hơn vai trò của người thực hiện thay đổi
         */
        if (roleOrder(role.title) >= roleOrder(roleTitle)) throw new Error();
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
    check("role", "Vai trò không cho phép")
      .optional()
      .custom(async (v, { req }) => {
        const { roleTitle } = req as RequestAuthenticate;

        /**
         * Nếu là top admin thì khỏi check
         */
        if (isRoleTopAdmin(roleTitle)) return true;

        /**
         * Nếu role lúc tạo không phải là admin thì thôi
         */
        if (!isRoleAdmin(v)) return true;

        const role = await Role.findOne({ title: v });

        /**
         * Role lúc tạo có thể là admin mà người này lại là người
         * lạ (đăng ký tài khoản) thì bắn lỗi
         */
        if (!roleTitle) throw new Error();

        /**
         * Người nào đó tạo user, nếu tạo user có role lớn hơn
         * hoặc bằng mình thì không được
         */
        if (roleOrder(roleTitle) > roleOrder(role?.title)) return true;
      }),

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

    check("tell", "Số điện thoại đã tồn tại")
      .optional()
      .custom(async (tell) => {
        if (tell === "") return;
        const doc = await PhoneService.findOne(tell);
        if (doc) throw new Error();
      }),

    check("tell", "Số điện thoại không hợp lệ")
      .optional()
      .if(check("region_code").exists())
      .custom(async (tell, { req }) => {
        if (tell === "") return;
        if (!req.body.region_code) throw new Error(`Cần cung cấp mã vùng`);
        const valid = PhoneService.isValid(tell, req.body.region_code);
        if (!valid) throw new Error();
      }),

    check("email", "Email không hợp lệ")
      //
      .optional()
      .if(check("email").notEmpty())
      .isEmail(),
    check("email", "Email đã tồn tại")
      .optional()
      .custom(async (email) => {
        if (email === "") return;
        const doc = await Email.findOne({ email });
        if (doc) throw new Error();
      }),
  ];
};
