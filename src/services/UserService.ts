import { Notification } from "@/models/Noti/Notification";
import { Email } from "@/models/User/Email";
import { Gender, TGender } from "@/models/User/Gender";
import { LoginToken } from "@/models/User/LoginToken";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role, TRole } from "@/models/User/Role";
import { Saved } from "@/models/User/Saved";
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
      searchQuery.$text = { $search: String(kw) };
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

    const q = User.aggregate([{ $match: searchQuery }]);

    if (sort_field === "createdAt" || sort_field === undefined) {
      q.sort({
        ["createdAt"]: sort || -1,
        _id: 1,
      });
    } else {
      q.sort({
        [sort_field]: sort || -1,
        createdAt: -1,
      });
    }

    if (limit !== 0) {
      q.skip(limit * (page - 1));

      q.limit(limit);
    }

    if (count !== undefined) {
      const qCount = User.countDocuments({
        ...searchQuery,
      });
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
      await Notification.deleteMany({ user: userId });
      await LoginToken.deleteMany({ user: userId });
      await Saved.deleteMany({ user: userId });
      UploadService.unLinkUserFolderSync(userId);

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
    console.log(`🚀 ~ UserService ~ updateUser ~ rest:`, rest);

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

    if (email || email === "") await user.addOrUpdateEmail(email, email_verify);
    else if (email_verify !== undefined) {
      user.email &&
        (await MailService.updateEmail(user.email._id, {
          verified: email_verify,
        }));
    }
  }
  async imageUpload(file: Express.Multer.File, userId: string | Types.ObjectId) {
    if (typeof userId !== "string") userId = userId.toString();

    const newPath = await UploadService.userAvatarFileUpload({ file, userId });

    return newPath;
  }
}

export default new UserService();
