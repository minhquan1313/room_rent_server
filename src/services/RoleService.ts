import { Role, RoleDocument, TRole } from "@/models/User/Role";

class RoleService {
  async getRoleAdmin(): Promise<RoleDocument | null> {
    return await Role.findOne({ title: "admin" });
  }
  async getRoleAdmin2(): Promise<RoleDocument | null> {
    return await Role.findOne({ title: "admin_lvl_2" });
  }
  async getRoleUser(): Promise<RoleDocument | null> {
    return await Role.findOne({ title: "user" });
  }
  async getRoleOwner(): Promise<RoleDocument | null> {
    return await Role.findOne({ title: "owner" });
  }
  async getUserAssignableRoles(): Promise<RoleDocument[]> {
    const t: TRole[] = ["owner", "user"];

    return await Role.find({ title: { $in: t } });
  }
}

export default new RoleService();
