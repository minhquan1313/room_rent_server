import { Email } from "@/models/User/Email";
import { Gender, TGender } from "@/models/User/Gender";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role, TRole } from "@/models/User/Role";
import { User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import RoomService from "@/services/RoomService";
import UploadService from "@/services/UploadService";
import mongoose, { Types } from "mongoose";

export interface TUserJSON {
  username: string;
  password: string;
  first_name: string;
  tell: string | number;
  region_code: string;
  disabled?: boolean;

  gender?: TGender;

  image?: string;
  last_name?: string;

  role?: TRole;

  owner_banner?: string;
  email?: string;

  file?: Express.Multer.File;
  file_to?: "avatar" | "banner";
}

class UserService {
  async get(query: Record<string, any>) {
    const userDocs = await User.findPopulated({}).lean();

    return userDocs;
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

  async createUser({ role, gender, email, tell, region_code, password, file, file_to, ...rest }: TUserJSON) {
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

  async updateUser(userId: string, { role, gender, email, tell, region_code, password, file, file_to, ...rest }: Partial<TUserJSON>) {
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

    if (tell && region_code) await user.addOrUpdatePhone(tell, region_code);

    if (email) await user.addOrUpdateEmail(email);
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
}

export default new UserService();
