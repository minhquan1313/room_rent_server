import { removeAccents } from "@/Utils/removeAccents";

const objs: {
  [k: string]: string;
} = {
  "ho chi minh": "/provinceImages/hoChiMinh.jpg",
  "ha noi": "/provinceImages/hoChiMinh.jpg",
};
// console.log(`🚀 ~ objs:`, objs);
export function provinceImagePathResolve(province?: string) {
  if (!province) return "";

  let t = removeAccents(province.toLowerCase());

  for (const key of Object.keys(objs)) {
    if (!t.includes(key)) continue;

    return objs[key];
  }
  return "";
}
