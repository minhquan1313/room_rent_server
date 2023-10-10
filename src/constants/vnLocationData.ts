import tinhThanhVN from "@/constants/tinhThanhVN.json";
import { TDistrict, TProvince, TWard } from "@/types/TProvinceLocal";

const [vnProvince, vnDistrict, vnWard] = (() => {
  const [vnProvince, vnDistrict] = (tinhThanhVN as TProvince[]).reduce<[TProvince[], TDistrict[]]>(
    (total, r1) => {
      const { districts: b1, ...r } = r1;
      const [a, b] = total;
      return [
        [...a, r1],
        [...b, ...b1],
      ];
    },
    [[], []]
  );

  const vnWard = vnDistrict.reduce<TWard[]>((t, { wards }) => [...t, ...wards], []);

  vnDistrict.sort((a, b) => a.code - b.code);
  vnProvince.sort((a, b) => a.code - b.code);
  vnWard.sort((a, b) => a.code - b.code);
  return [vnProvince, vnDistrict, vnWard];
})();

export { vnDistrict, vnProvince, vnWard };
