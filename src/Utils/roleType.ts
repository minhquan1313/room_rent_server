import { TRole } from "@/models/User/Role";

export const TOP_ADMIN_ROLES: (TRole | undefined)[] = ["admin"];
export const ADMIN_ROLES: (TRole | undefined)[] = [...TOP_ADMIN_ROLES, "admin_lvl_2"];
export const OWNER_ROLES: (TRole | undefined)[] = [...ADMIN_ROLES, "owner"];
export const USER_ROLES: (TRole | undefined)[] = [...OWNER_ROLES, "user"];

export function isRoleTopAdmin(role?: string) {
  return TOP_ADMIN_ROLES.includes(role as any);
}
export function isRoleAdmin(role?: string) {
  return ADMIN_ROLES.includes(role as any);
}
export function isRoleOwner(role?: string) {
  return OWNER_ROLES.includes(role as any);
}
export function isRoleUser(role?: string) {
  return USER_ROLES.includes(role as any);
}
