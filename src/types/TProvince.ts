// {
//   "name": "Tỉnh Tiền Giang",
//   "code": 82,
//   "codename": "tinh_tien_giang",
//   "division_type": "tỉnh",
//   "phone_code": 273,
//   "districts": [
//     {
//       "name": "Thành phố Mỹ Tho",
//       "code": 815,
//       "codename": "thanh_pho_my_tho",
//       "division_type": "thành phố",
//       "short_codename": "my_tho",
//       "wards": [
//         {
//           "name": "Phường 5",
//           "code": 28249,
//           "codename": "phuong_5",
//           "division_type": "phường",
//           "short_codename": "phuong_5"
//         },

// Tỉnh
export interface IProvince {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  phone_code: number;
  districts: IDistrict[];
}

// Huyện
export interface IDistrict {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: IWard[];
}

// Phường
export interface IWard {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}
