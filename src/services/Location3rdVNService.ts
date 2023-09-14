import { Location3rd } from "@/types/Location3rd";
import { IDistrictResponse, IProvinceResponse, IWardResponse } from "@/types/TProvince";
import axios from "axios";

//Cấp tỉnh: Tỉnh / Thành phố trực thuộc trung ương
//Cấp huyện: Quận / Huyện / Thị xã / Thành phố thuộc tỉnh / Thành phố thuộc thành phố trực thuộc trung ương
//Cấp xã: Xã / Phường / Thị trấn.
const fetcher = axios.create({
  baseURL: "https://vn-public-apis.fpo.vn",
});

// fetcher.interceptors.response.use(
//   function (response) {

//     return response.data;
//   },
//   function (error) {
//     // throw error;
//     return Promise.reject(error);
//   },
// );

class Location3rdVNService {
  async getCountries(): Promise<Location3rd[]> {
    return [
      {
        code: "1",
        name: "Việt Nam",
      },
    ];
  }
  // Tỉnh/Thành phố
  async getProvinces(countryCode?: number): Promise<Location3rd[]> {
    const data = await fetcher.get<IProvinceResponse>("/provinces/getAll?limit=-1");
    return Array.isArray(data.data.data)
      ? []
      : data.data.data.data.map((e) => ({
          name: e.name,
          code: e.code,
        }));
  }

  // Huyện/Thị xã/Thành phố
  async getDistricts(provinceCode?: number): Promise<Location3rd[]> {
    const url = provinceCode
      ? //
        `/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      : `/districts/getAll`;
    const data = await fetcher.get<IDistrictResponse>(url);

    return Array.isArray(data.data.data)
      ? []
      : data.data.data.data.map((e) => ({
          name: e.name,
          code: e.code,
        }));
  }

  // Xã/Phường/Thị trấn
  async getWards(districtCode?: number): Promise<Location3rd[]> {
    const url = districtCode
      ? //
        `/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      : `/getAll/getAll`;
    const data = await fetcher.get<IWardResponse>(url);
    console.log(`🚀 ~ Location3rdVNService ~ getWards ~ data:`, data.data.data);

    return Array.isArray(data.data.data)
      ? []
      : data.data.data.data.map((e) => ({
          name: e.name_with_type,
          code: e.code,
        }));
  }

  async resolveProvince(value: string) {
    const url = `/provinces/getAll?q=${value}&cols=name`;
    const data = await fetcher.get<IProvinceResponse>(url);

    return Array.isArray(data.data.data)
      ? null
      : data.data.data.data.map((e) => ({
          name: e.name,
          code: e.code,
        }))[0];
  }
  async resolveDistrict(value: string) {
    const url = `/districts/getAll?q=${value}&cols=name`;
    const data = await fetcher.get<IDistrictResponse>(url);

    return Array.isArray(data.data.data)
      ? null
      : data.data.data.data.map((e) => ({
          name: e.name,
          code: e.code,
        }))[0];
  }
  async resolveWard(value: string) {
    const url = `/wards/getAll?q=${value}&cols=name`;
    const data = await fetcher.get<IWardResponse>(url);

    return Array.isArray(data.data.data)
      ? null
      : data.data.data.data.map((e) => ({
          name: e.name,
          code: e.code,
        }))[0];
  }
}

export default new Location3rdVNService();
