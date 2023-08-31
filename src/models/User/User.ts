import { Email } from "@/models/User/Email";
import { Gender } from "@/models/User/Gender";
import { Role, TRole } from "@/models/User/Role";
import LoginTokenService from "@/services/LoginTokenService";
import UserService from "@/services/UserService";
import { check } from "express-validator";
import { Document, Schema, Types, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  first_name: string;
  last_name: string | null;
  image: string | null;
  owner_banner: string | null;
  disabled: boolean;
  gender: Types.ObjectId;
  role: Types.ObjectId;
  tel: Types.ObjectId;
  email: Types.ObjectId | null;
  updatedAt: Date;
  createdAt: Date;
}
export type TUserDocument = Document<unknown, {}, IUser> &
  IUser & {
    _id: Types.ObjectId;
  };

const schema = new Schema<IUser>(
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
    owner_banner: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: Schema.Types.ObjectId,
      ref: "Gender",
      default: null,
    },
    role: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Role",
    },

    tel: {
      type: Schema.Types.ObjectId,
      default: null,
      // required: true,
      ref: "PhoneNumber",
    },
    email: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Email",
    },
  },
  {
    timestamps: true,
    // methods: {
    //   async hasUpdatePermission() {
    //     const role = this.role.toString();
    //     const allowedRole = (
    //       await Role.find({
    //         $or: [
    //           {
    //             title: "admin",
    //           },
    //           {
    //             title: "admin_lvl_2",
    //           },
    //         ],
    //       })
    //     ).map((r) => r.title);

    //     return allowedRole.includes(role);
    //   },
    // },
    statics: {
      getUsers: async () => {
        const role = Role.getRoleUser();
        return await model("User").find({ role });
      },
      getOwner: async () => {
        const role = Role.getRoleOwner();
        return await model("User").find({ role });
      },
    },
  }
);

// function autoPopulate(this: any, next: () => void) {
//   this.populate("email").populate("tel").populate("role").populate("gender");
//   next();
// }
// schema.pre("findOne", autoPopulate);
schema.pre("find", function (next) {
  this.sort({
    createdAt: -1,
  });

  next();
});

const User = model("User", schema);

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

  let user = await User.findOne({ role: roleAdmin });

  if (!user) {
    const gender = await Gender.findOne({ title: "male" });
    if (!gender) throw new Error(`No genders`);

    user = await UserService.createUser({
      username: defaultAdminInfo.username,
      password: defaultAdminInfo.pass,
      first_name: defaultAdminInfo.fn,
      last_name: defaultAdminInfo.ln,
      tell: defaultAdminInfo.tel,
      region_code: defaultAdminInfo.telCode,
      gender: gender._id.toString(),
    });
    const userId = user!._id.toString();
    await UserService.changeRole(userId, roleAdmin.title as TRole);

    await LoginTokenService.makeToken({ username: defaultAdminInfo.username, userId });
  }
}

const validateRegisterUser = () => {
  return [
    check("username", "Tên người dùng không được trống").not().isEmpty(),
    // check("username", "").isAlphanumeric(),
    check("username", "Tên người dùng từ 6 kí tự trở lên").isLength({ min: 6 }),
    check("username", "Tên người dùng không chứa khoảng trắng").not().contains(" "),
    check("password", "Mật khẩu 6 kí tự trở lên").isLength({ min: 6 }),
    check("first_name", "Tên không được để trống").not().isEmpty(),
    check("tell", "Số điện thoại không được trống").not().isEmpty(),
    check("region_code", "Thiếu mã vùng").not().isEmpty(),
    // check("email", "Email không hợp lệ").isEmail(),
  ];
};
const validateLoginUser = () => {
  return [check("username", "Tên người dùng không được trống").not().isEmpty(), check("password", "Mật khẩu 6 kí tự trở lên").not().isEmpty()];
};

export { User, createAdminOnStart, validateLoginUser, validateRegisterUser };
