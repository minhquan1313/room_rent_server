import { Email } from "@/models/User/Email";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import LoginTokenService from "@/services/LoginTokenService";
import PhoneService from "@/services/PhoneService";
import RoleService from "@/services/RoleService";
import UserService from "@/services/UserService";
import { MongooseDocConvert } from "@/types/MongooseDocConvert";
import { check } from "express-validator";
import { Model, Query, Schema, Types, model } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;

  username: string;
  password: string;
  first_name: string;
  last_name: string | null;
  image: string | null;
  owner_banner: string | null;
  disabled: boolean;
  gender: Types.ObjectId;
  role: Types.ObjectId;
  phone: Types.ObjectId | null;
  email: Types.ObjectId | null;

  updatedAt: Date;
  createdAt: Date;
}
interface IUserMethods {
  addOrUpdatePhone(tell: string | number, region_code: string): Promise<boolean>;
  addOrUpdateEmail(email: string): Promise<boolean>;
  populateAll(): Promise<UserDocument>;
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  // static methods
  findPopulated(query?: Partial<IUser>): Query<UserDocument[], UserDocument, unknown, any, "find">;
}

export type UserDocument = MongooseDocConvert<IUser, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>(
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
    phone: {
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
    methods: {
      async addOrUpdatePhone(this: UserDocument, tell: string | number, region_code: string): Promise<boolean> {
        if (this.phone) {
          // already has a phone number
          const phone = await PhoneNumber.findById(this.phone);
          if (!phone) {
            // phone not in collection
            await PhoneService.create(this._id, tell, region_code, this.phone.toString());

            return true;
          }

          const p = await PhoneService.update(phone.e164_format, tell, region_code);
          if (!p) return false;
        } else {
          const p = await PhoneService.create(this._id, tell, region_code);
          if (!p) return false;

          this.phone = p._id;
          await this.save();
        }

        return true;
      },
      async addOrUpdateEmail(this: UserDocument, email: string): Promise<boolean> {
        if (this.email) {
          // already has a email
          const emailDoc = await Email.findById(this.email);
          if (!emailDoc) {
            // email not in collection
            await Email.create({
              _id: this.email,
              user: this._id,
              email,
            });

            return true;
          }

          await Email.findOneAndUpdate(
            {
              _id: this.email,
            },
            {
              email,
            }
          );
        } else {
          const p = await Email.create({
            user: this._id,
            email,
          });
          if (!p) return false;

          this.email = p._id;
          await this.save();
        }

        return true;
      },
      async populateAll(this: UserDocument) {
        return await this.populate([
          {
            path: "role",
          },
          {
            path: "phone",
          },
          {
            path: "email",
          },
          {
            path: "gender",
          },
        ]);
      },
    },
    statics: {
      findPopulated(query) {
        return (
          model("User")
            .find(query)
            //
            .populate([
              {
                path: "gender",
              },
              {
                path: "role",
              },
              {
                path: "phone",
              },
              {
                path: "email",
              },
            ])
        );
      },
    },
  }
);

const User = model<IUser, UserModel>("User", schema);

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

  const roleAdmin = await RoleService.getRoleAdmin();
  if (!roleAdmin) return;

  let user = await User.findOne({ role: roleAdmin });

  if (!user) {
    user = await UserService.createUser({
      username: defaultAdminInfo.username,
      password: defaultAdminInfo.pass,
      first_name: defaultAdminInfo.fn,
      last_name: defaultAdminInfo.ln,
      tell: defaultAdminInfo.tel,
      region_code: defaultAdminInfo.telCode,
      gender: "male",
      role: roleAdmin.title,
    });

    if (!(await Email.findOne({ email: defaultAdminInfo.email }))) {
      user?.addOrUpdateEmail(defaultAdminInfo.email);
    }
    const userId = user!._id;

    // const token = await LoginTokenService.makeToken({ username: defaultAdminInfo.username, userId });
    const token = await LoginTokenService.makeTokenRaw({
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiY3JlYXRlZEF0IjoxNjkzNTQzODYyNTMzLCJpYXQiOjE2OTM1NDM4NjJ9.TVu0YEJ7Ym8d_7C_WHrYA5As4j6g6tb2V5zMp16CEzM",
      userId,
    });

    // });
    console.log(`🚀 ~ createAdminOnStart ~ token:`, token);
  }
}

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
    check("tell", "Số điện thoại không hợp lệ")
      .optional()
      .if(check("region_code").exists())
      .custom(async (value, { req }) => {
        const valid = PhoneService.isValid(req.body.tell, req.body.region_code);
        if (!valid) throw new Error();
      }),

    check("region_code", "Thiếu mã vùng").not().isEmpty(),

    check("email", "Email không hợp lệ").optional().isEmail(),
    check("email", "Email đã tồn tại")
      .optional()
      .custom(async (value, { req }) => {
        const doc = await Email.findOne({ email: req.body.email });
        if (doc) throw new Error();
      }),
  ];
};
export const validateUpdateUser = () => {
  return [
    //
    check("username", "Tên người dùng không được đổi").not().exists(),
  ];
};

export const validateLoginUser = () => {
  return [
    check("username", "Tên người dùng không được trống").not().isEmpty(),
    check("username", "Tên người dùng không chứa khoảng trắng").not().contains(" "),

    check("password", "Mật khẩu không được trống").not().isEmpty(),
  ];
};

export { User, createAdminOnStart };
