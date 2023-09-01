import { Email } from "@/models/User/Email";
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
  gender?: string;
  image?: string;
  last_name?: string;
  role?: TRole;
  owner_banner?: string;
  email?: string;
}

class UserService {
  async get(query: Record<string, any>) {
    const userDocs = await User.find({}).populate("email").populate("phone").populate("role").populate("gender");

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

  async createUser({ role, email, tell, region_code, password, ...data }: UserFormData) {
    if (!process.env.PRIVATE_JWT_KEY) return null;

    // const { role, email, tell, region_code, password, ...data } = formData;

    let _role;

    switch (role) {
      case "owner":
        _role = await Role.getRoleOwner();
        break;

      default:
        _role = await Role.getRoleUser();
        break;
    }

    let mail = undefined;

    const encodedPassword = LoginTokenService.encodePassword(password);
    const user = await User.create({
      ...data,
      role: _role,
      email: mail,
      password: encodedPassword,
    });
    await user.addOrUpdatePhone(tell, region_code);
    if (email) {
      await user.addOrUpdateEmail(email);
    }
    const _user = await User.findOne({ _id: user._id }).populate("email").populate("phone").populate("role").populate("gender");

    return _user;
  }

  async updateUser(userId: string, { email, tell, region_code, password, role, ...f }: Partial<UserFormData>) {
    const user = await User.findById(userId);
    if (!user) return null;

    // const { email, tell, region_code, password, username, role, ...f } = formData;

    let obj: any = {
      ...f,
    };

    if (password) {
      obj.password = LoginTokenService.encodePassword(password);
    }

    await user.updateOne(obj);

    if (tell && region_code) {
      await user.addOrUpdatePhone(tell, region_code);
    }
    if (email) {
      await user.addOrUpdateEmail(email);
    }

    const _user = await User.findOne({ _id: userId }).populate("email").populate("phone").populate("role").populate("gender");
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

    const _user = await User.findOne({ _id: userId }).populate("email").populate("phone").populate("role").populate("gender");
    return _user;
  }
  async getImageOfUser(userId: string) {}
}

export default new UserService();
