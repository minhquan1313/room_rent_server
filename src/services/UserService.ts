import { Email } from "@/models/User/Email";
import { Gender, TGender } from "@/models/User/Gender";
import { PhoneNumber } from "@/models/User/PhoneNumber";
import { Role, TRole } from "@/models/User/Role";
import { User } from "@/models/User/User";
import LoginTokenService from "@/services/LoginTokenService";
import RoomService from "@/services/RoomService";
import { Types } from "mongoose";

export interface UserFormData {
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
}

class UserService {
  async get(query: Record<string, any>) {
    const userDocs = await User.findPopulated({});

    return userDocs;
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

  async createUser({ role, gender, email, tell, region_code, password, ...data }: UserFormData) {
    if (!process.env.PRIVATE_JWT_KEY) return null;

    let _role;

    switch (role) {
      case "owner":
        _role = await Role.getRoleOwner();
        break;

      default:
        _role = await Role.getRoleUser();
        break;
    }

    const encodedPassword = LoginTokenService.encodePassword(password);
    const user = await User.create({
      ...data,
      role: _role,
      gender: (await Gender.findOne({ title: gender })) ?? undefined,
      password: encodedPassword,
    });

    await user.addOrUpdatePhone(tell, region_code);

    if (email) await user.addOrUpdateEmail(email);

    const _user = (await User.findPopulated({ _id: user._id }))[0];
    return _user;
  }

  async updateUser(userId: string, { email, tell, gender, region_code, password, role, ...f }: Partial<UserFormData>) {
    const user = await User.findById(userId);
    if (!user) return null;

    await user.updateOne({
      ...f,
      password: password ? LoginTokenService.encodePassword(password) : undefined,
      gender: gender ? (await Gender.findOne({ title: gender })) ?? undefined : undefined,
    });

    if (tell && region_code) await user.addOrUpdatePhone(tell, region_code);

    if (email) await user.addOrUpdateEmail(email);

    const _user = (await User.findPopulated({ _id: userId }))[0];
    return _user;
  }
  async changeRole(userId: string | Types.ObjectId, role: TRole) {
    const r = await Role.findOne({
      title: role,
    });
    const user = await User.findById(userId);
    if (!r || !user) return null;

    user.role = r._id;

    await user.save();

    const _user = await (await User.findOne({ _id: userId }))?.populateAll();
    return _user;
  }
  async getImageOfUser(userId: string) {}
}

export default new UserService();
