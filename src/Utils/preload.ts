import { autoCreateRoles } from "@/models/Role";

export default function preload() {
  autoCreateRoles();
}
