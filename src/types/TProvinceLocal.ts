export type TProvince = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: TDistrict[];
};
export type TDistrict = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: TWard[];
};
export type TWard = {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
};
