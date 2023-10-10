import { TRole } from "@/models/User/Role";

export const TOP_ADMIN_ROLES: TRole[] = ["admin"];
export const ADMIN_ROLES: TRole[] = [...TOP_ADMIN_ROLES, "admin_lvl_2"];
export const OWNER_ROLES: TRole[] = [...ADMIN_ROLES, "owner"];
export const USER_ROLES: TRole[] = [...OWNER_ROLES, "user"];

export const USER_ROLES_REVERSE = [...USER_ROLES].reverse();

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

export function roleOrder(role?: string) {
  return USER_ROLES_REVERSE.indexOf(role as TRole);
}
