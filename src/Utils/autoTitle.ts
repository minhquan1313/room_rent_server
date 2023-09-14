import { removeAccents } from "@/Utils/removeAccents";

export function autoTitle(display_name: string) {
  const title = removeAccents(display_name.toLowerCase())
    .split(/\s+/)
    .map((e) => e[0])
    .join("");

  return title;
}
