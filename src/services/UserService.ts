import mongooseUtils from "@/Utils/mongooseUtils";
import { Email } from "@/models/User/Email";
import { Role } from "@/models/User/Role";
import { User } from "@/models/User/User";
import PhoneService from "@/services/PhoneService";

export interface UserFormData {
  username: string;
  password: string;
  first_name: string;
  tell: string;
  region_code: string;
  image?: string;
  last_name?: string;
  role?: string;
  owner_banner?: string;
  email?: string;
}

class UserService {
  async get(params: Record<string, string>) {
    const userDocs = await User.find();
    let users = [];
    users = mongooseUtils.toObject(userDocs).map(this.userObject);

    return users;
  }
  async getById(id: string) {
    const item = await User.findById(id);

    if (item === null) return null;

    return this.userObject(mongooseUtils.toObject(item));
  }

  userObject(u: Record<string, any>) {
    const { password, ...user } = u;

    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) return false;

    await user.deleteOne();

    return true;
  }

  async createUser(formData: UserFormData) {
    const { role, email, tell, region_code, ...data } = formData;

    let _role;

    switch (role) {
      case "owner":
        _role = await Role.getRoleOwner();
        break;

      default:
        _role = await Role.getRoleUser();
        break;
    }

    const phone = await PhoneService.create(tell, region_code);

    let mail = undefined;

    if (email) {
      mail = await Email.create({
        email,
      });
    }

    const _user = await User.create({
      ...data,
      tel: phone,
      role: _role,
      email: mail,
    });

    const user = this.userObject(mongooseUtils.toObject(_user));

    return user;
  }
}

export default new UserService();
