import { Email } from "@/models/User/Email";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role } from "@/models/User/Role";
import PhoneService from "@/services/PhoneService";
import { check } from "express-validator";
import mongoose, { Schema, Types } from "mongoose";

const schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    // Tên
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    // Họ và tên đệm
    last_name: {
      type: String,
      default: null,
      trim: true,
    },
    image: {
      type: String,
      default: null,
      trim: true,
    },
    role: {
      type: Types.ObjectId,
      default: null,
      ref: "Role",
    },
    owner_banner: {
      type: String,
      default: null,
    },
    tel: {
      type: Types.ObjectId,
      default: null,
      // required: true,
      ref: "PhoneNumber",
    },
    email: {
      type: Types.ObjectId,
      default: null,
      ref: "Email",
    },
  },
  {
    timestamps: true,
    statics: {
      getUsers: () => {},
      getOwner: () => {},
    },
  }
);

type x = typeof schema;
let z: x;

const User = mongoose.model("User", schema);

async function createAdminOnStart() {
  const defaultAdminInfo = {
    email: "2051012011binh@ou.edu.vn",
    tel: 889379139,
    telCode: "vn",
    username: "admin",
    pass: "1",
    fn: "Bình",
    ln: "Mai Thanh",
  };

  const roleAdmin = await Role.getRoleAdmin();
  if (!roleAdmin) return;

  let email = await Email.findOne({ email: defaultAdminInfo.email });
  if (!email) {
    email = await Email.create({
      email: defaultAdminInfo.email,
      verified: true,
    });
  }

  let tel = await PhoneNumber.findOne({ national_number: defaultAdminInfo.tel });
  if (!tel) {
    tel = await PhoneService.create(defaultAdminInfo.tel, defaultAdminInfo.telCode);
  }

  let user = await User.findOne({ role: roleAdmin });
  if (!user) {
    user = await User.create({
      username: defaultAdminInfo.username,
      password: defaultAdminInfo.pass,
      first_name: defaultAdminInfo.fn,
      last_name: defaultAdminInfo.ln,
      role: roleAdmin,
      email,
      tel,
    });
  }
}

const validateRegisterUser = () => {
  return [
    check("username", "Tên người dùng không được trống").not().isEmpty(),
    check("username", "Tên người dùng chỉ được là số và chữ").isAlphanumeric(),
    check("username", "Tên người dùng từ 6 kí tự trở lên").isLength({ min: 6 }),
    check("password", "Mật khẩu 6 kí tự trở lên").isLength({ min: 6 }),
    check("first_name", "Tên không được để trống").not().isEmpty(),
    check("tell", "Số điện thoại không được trống").not().isEmpty(),
    check("region_code", "Thiếu mã vùng").not().isEmpty(),
    // check("email", "Email không hợp lệ").isEmail(),
  ];
};

export { User, createAdminOnStart, validateRegisterUser };
