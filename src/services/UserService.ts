import { Email } from "@/models/User/Email";
import { Gender, TGender } from "@/models/User/Gender";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role, TRole } from "@/models/User/Role";
import { IUser, User, populatePaths } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import MailService from "@/services/MailService";
import PhoneService from "@/services/PhoneService";
import RoomService from "@/services/RoomService";
import UploadService from "@/services/UploadService";
import { ModelToPayload } from "@/types/ModelToPayload";
import { TCommonQuery } from "@/types/TCommonQuery";
import mongoose, { FilterQuery, Types } from "mongoose";

export interface BodyPayload {
  username: string;
  password: string;
  first_name: string;

  tell: string | number;
  region_code: string;
  tell_verify?: boolean;

  disabled?: boolean;

  gender?: TGender;

  image?: string;
  last_name?: string;

  role?: TRole;

  owner_banner?: string;
  email?: string;
  email_verify?: boolean;

  file?: Express.Multer.File;
  file_to?: "avatar" | "banner";
}

type TQuery = ModelToPayload<IUser> & TCommonQuery;
class UserService {
  async get(query: TQuery) {
    const {
      sort,
      sort_field,
      limit = 99,
      page = 1,
      kw,
      count,
      //
      role,
      gender,

      phone,
      email,

      disabled,
      //
      ...qq
    } = query;
    console.log(`🚀 ~ UserService ~ get ~ query:`, query);

    const searchQuery: FilterQuery<IUser> = qq;
    if ("_id" in qq) searchQuery._id = new Types.ObjectId(qq._id);

    if (kw) {
      searchQuery.$text = { $search: kw };
    }
    if (role) {
      searchQuery.role = {
        $in: (await Role.find({ title: role })).map((r) => r._id),
      };
    }
    if (gender) {
      searchQuery.gender = {
        $in: (await Gender.find({ title: gender })).map((r) => r._id),
      };
    }
    if (phone) {
      searchQuery.phone = {
        $in: (
          await PhoneNumber.find({
            e164_format: {
              $regex: new RegExp(phone),
            },
          })
        ).map((r) => r._id),
      };
    }
    if (email) {
      searchQuery.email = {
        $in: (
          await Email.find({
            email: {
              $regex: new RegExp(email),
            },
          })
        ).map((r) => r._id),
      };
    }
    if (disabled !== undefined) {
      searchQuery.disabled =
        typeof disabled === "object"
          ? {
              $in: disabled,
            }
          : disabled;
    }

    console.log(`🚀 ~ UserService ~ get ~ searchQuery:`, searchQuery);

    const qCount = User.countDocuments({
      ...searchQuery,
    });
    const q = User.aggregate([{ $match: searchQuery }]);

    q.sort({
      [sort_field || "createdAt"]: sort || -1,
    });
    if (limit !== 0) {
      q.skip(limit * (page - 1));
      q.limit(limit);
    }

    if (count !== undefined) {
      const [count, data] = await Promise.all([qCount.exec(), q.exec()]);
      await User.populate(data, populatePaths);

      return { data, count };
    } else {
      const data = await q.exec();

      await User.populate(data, populatePaths);
      return data;
    }
  }

  async getSingle(id: string) {
    const userDoc = await User.findById(id).lean();

    return userDoc;
  }

  async deleteUser(userId: string) {
    try {
      const user = await User.findById(userId);
      if (!user) return false;

      await Email.findByIdAndDelete(user.email);
      await PhoneNumber.findByIdAndDelete(user.phone);
      await RoomService.deleteManyByUserId(user._id);

      await user.deleteOne();

      return true;
    } catch (error) {
      console.log(`🚀 ~ UserService ~ deleteUser ~ error:`, error);

      return false;
    }
  }

  async createUser({ role, gender, email, tell, region_code, password, file, file_to, ...rest }: BodyPayload) {
    const _id = new mongoose.mongo.ObjectId();

    if (file) {
      switch (file_to) {
        case "avatar":
          rest.image = (await this.imageUpload(file, _id)).srcForDb;
          break;
        case "banner":
          rest.owner_banner = (await this.imageUpload(file, _id)).srcForDb;
          break;

        default:
          rest.image = (await this.imageUpload(file, _id)).srcForDb;
      }
    }

    const user = await User.create({
      ...rest,
      _id,
      password: password ? LoginTokenService.encodePassword(password) : undefined,
      gender: (gender && (await Gender.findOne({ title: gender }))) || undefined,
      role: (role && (await Role.findOne({ title: role }))) || undefined,
    });

    if (tell && region_code) await user.addOrUpdatePhone(tell, region_code);

    if (email) await user.addOrUpdateEmail(email);

    return await user.populateAll();
  }

  async updateUser(userId: string, { role, gender, email, email_verify, tell_verify, tell, region_code, password, file, file_to, ...rest }: Partial<BodyPayload>) {
    const user = (await User.findById(userId))!;

    if (file) {
      switch (file_to) {
        case "avatar":
          rest.image = (await this.imageUpload(file, user._id)).srcForDb;
          break;
        case "banner":
          rest.owner_banner = (await this.imageUpload(file, user._id)).srcForDb;
          break;

        default:
          rest.image = (await this.imageUpload(file, user._id)).srcForDb;
      }
    }

    // if (!force) {
    //   if (password && old_password) {
    //     if (LoginTokenService.encodePassword(old_password) !== user.password) {
    //       throw new Error(`Password not match`);
    //     }
    //   } else {
    //     password = undefined;
    //   }
    // }

    await user.updateOne({
      ...rest,
      password: password ? LoginTokenService.encodePassword(password) : undefined,
      gender: (gender && (await Gender.findOne({ title: gender }))) || undefined,
      role: (role && (await Role.findOne({ title: role }))) || undefined,
    });

    if ((tell && region_code) || tell === "") {
      await user.addOrUpdatePhone(tell, region_code || "", tell_verify);
    } else if (tell_verify !== undefined) {
      user.phone &&
        PhoneService.updateValidId({
          _id: user.phone,
          valid: tell_verify,
        });
    }
    // if (tell_verify !== undefined) {
    // PhoneService.updateValidId({

    // })
    // }

    if (email || email === "") await user.addOrUpdateEmail(email, email_verify);
    else if (email_verify !== undefined) {
      user.email &&
        (await MailService.updateEmail(user.email._id, {
          verified: email_verify,
        }));
    }
  }
  // async changeRole(userId: string | Types.ObjectId, role: TRole) {
  //   const r = await Role.findOne({
  //     title: role,
  //   });
  //   const user = await User.findById(userId);
  //   if (!r || !user) return null;

  //   user.role = r._id;

  //   await user.save();

  //   const _user = await (await User.findOne({ _id: userId }))?.populateAll();
  //   return _user;
  // }
  // async getImageOfUser(userId: string) {}
  async imageUpload(file: Express.Multer.File, userId: string | Types.ObjectId) {
    if (typeof userId !== "string") userId = userId.toString();

    const newPath = await UploadService.userAvatarFileUpload({ file, userId });

    return newPath;
  }

  // async updateUserV2(userId: string, body: Partial<ModelToPayload<IUser>> & { file?: File; file_to?: "image" | "owner_banner" }) {
  //   const { gender, role, email, phone } = body;

  //   const user = (await User.findById(userId)) as UserDocument;

  //   if (gender) {
  //     user.gender = (await Gender.findOne(gender as any))!._id;
  //   }

  //   if (role) {
  //     user.role = (await Role.findOne(role as any))!._id;
  //   }

  //   if (email) {
  //     const _ = email as unknown as IEmail;

  //     if (user.email) {
  //       await MailService.updateEmail(user.email, _);
  //       if (_.email === "") {
  //         user.email = null;
  //       }
  //     } else {
  //       const e = await MailService.createEmail({
  //         ..._,
  //         user: user._id,
  //       });
  //       user.email = e._id;
  //     }
  //   }

  //   if (phone) {
  //     const _ = phone as unknown as IPhoneNumber;

  //     if (user.phone) {
  //       if (_.e164_format === "" && _.national_number === undefined) {
  //         await PhoneService.delete(user.phone);
  //         user.phone = null;
  //       } else {
  //         await PhoneService.update(user.phone, _.e164_format, _.region_code);
  //       }
  //     } else {
  //       const e = await PhoneService.create(user._id, _.e164_format || _.national_number, _.region_code)!;

  //       user.phone = e._id;
  //     }
  //   }

  //   await user.save();

  //   return true;
  //   //
  // }
}

export default new UserService();
