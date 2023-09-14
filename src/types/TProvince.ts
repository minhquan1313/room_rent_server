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
export interface IProvinceResponse {
  exitcode: number;
  data:
    | {
        nItems: number;
        nPages: number;
        data: {
          _id: string;
          name: string;
          slug: string;
          type: string;
          name_with_type: string;
          code: string;
          isDeleted: boolean;
        }[];
      }
    | [];
  message: string;
}

// Huyện
export interface IDistrictResponse {
  exitcode: number;
  data:
    | {
        nItems: number;
        nPages: number;
        data: {
          _id: string;
          name: string;
          type: string;
          slug: string;
          name_with_type: string;
          path: string;
          path_with_type: string;
          code: string;
          parent_code: string;
          isDeleted: boolean;
        }[];
      }
    | [];
  message: string;
}

// Phường
export interface IWardResponse {
  exitcode: number;
  data:
    | {
        nItems: number;
        nPages: number;
        data: {
          _id: string;
          name: string;
          type: string;
          slug: string;
          name_with_type: string;
          path: string;
          path_with_type: string;
          code: string;
          parent_code: string;
          isDeleted: boolean;
        }[];
      }
    | [];
  message: string;
}

let z = () => ({
  exitcode: 1,
  data: {
    nItems: 17,
    nPages: -17,
    data: [
      {
        _id: "60eaaa721173335842c36aab",
        name: "1",
        type: "phuong",
        slug: "1",
        name_with_type: "Phường 1",
        path: "1, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 1, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28261",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab0",
        name: "10",
        type: "phuong",
        slug: "10",
        name_with_type: "Phường 10",
        path: "10, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 10, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28276",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aac",
        name: "2",
        type: "phuong",
        slug: "2",
        name_with_type: "Phường 2",
        path: "2, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 2, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28264",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aaa",
        name: "3",
        type: "phuong",
        slug: "3",
        name_with_type: "Phường 3",
        path: "3, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 3, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28258",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aa8",
        name: "4",
        type: "phuong",
        slug: "4",
        name_with_type: "Phường 4",
        path: "4, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 4, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28252",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aa7",
        name: "5",
        type: "phuong",
        slug: "5",
        name_with_type: "Phường 5",
        path: "5, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 5, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28249",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aae",
        name: "6",
        type: "phuong",
        slug: "6",
        name_with_type: "Phường 6",
        path: "6, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 6, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28270",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aa9",
        name: "7",
        type: "phuong",
        slug: "7",
        name_with_type: "Phường 7",
        path: "7, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 7, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28255",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aad",
        name: "8",
        type: "phuong",
        slug: "8",
        name_with_type: "Phường 8",
        path: "8, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 8, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28267",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36aaf",
        name: "9",
        type: "phuong",
        slug: "9",
        name_with_type: "Phường 9",
        path: "9, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường 9, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28273",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab2",
        name: "Đạo Thạnh",
        type: "xa",
        slug: "dao-thanh",
        name_with_type: "Xã Đạo Thạnh",
        path: "Đạo Thạnh, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Đạo Thạnh, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28282",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab4",
        name: "Mỹ Phong",
        type: "xa",
        slug: "my-phong",
        name_with_type: "Xã Mỹ Phong",
        path: "Mỹ Phong, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Mỹ Phong, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28288",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab6",
        name: "Phước Thạnh",
        type: "xa",
        slug: "phuoc-thanh",
        name_with_type: "Xã Phước Thạnh",
        path: "Phước Thạnh, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Phước Thạnh, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28567",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab1",
        name: "Tân Long",
        type: "phuong",
        slug: "tan-long",
        name_with_type: "Phường Tân Long",
        path: "Tân Long, Mỹ Tho, Tiền Giang",
        path_with_type: "Phường Tân Long, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28279",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab5",
        name: "Tân Mỹ Chánh",
        type: "xa",
        slug: "tan-my-chanh",
        name_with_type: "Xã Tân Mỹ Chánh",
        path: "Tân Mỹ Chánh, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Tân Mỹ Chánh, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28291",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab7",
        name: "Thới Sơn",
        type: "xa",
        slug: "thoi-son",
        name_with_type: "Xã Thới Sơn",
        path: "Thới Sơn, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Thới Sơn, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28591",
        parent_code: "815",
        isDeleted: false,
      },
      {
        _id: "60eaaa721173335842c36ab3",
        name: "Trung An",
        type: "xa",
        slug: "trung-an",
        name_with_type: "Xã Trung An",
        path: "Trung An, Mỹ Tho, Tiền Giang",
        path_with_type: "Xã Trung An, Thành phố Mỹ Tho, Tỉnh Tiền Giang",
        code: "28285",
        parent_code: "815",
        isDeleted: false,
      },
    ],
  },
  message: "Get item successful",
});
