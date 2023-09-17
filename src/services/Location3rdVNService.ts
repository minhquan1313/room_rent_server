import { Location3rd } from "@/types/Location3rd";
import { IDistrictResponse, IProvinceResponse, IWardResponse } from "@/types/TProvince";
import axios from "axios";

//Cấp tỉnh: Tỉnh / Thành phố trực thuộc trung ương
//Cấp huyện: Quận / Huyện / Thị xã / Thành phố thuộc tỉnh / Thành phố thuộc thành phố trực thuộc trung ương
//Cấp xã: Xã / Phường / Thị trấn.
const fetcher = axios.create({
  baseURL: "https://vn-public-apis.fpo.vn",
});

type FetchData = {
  name: string;
  code: string;
}[];
fetcher.interceptors.response.use(
  function (response) {
    const data = response.data as IWardResponse | IDistrictResponse | IProvinceResponse;

    return Array.isArray(data.data)
      ? []
      : (data.data.data.map((e) => ({
          name: e.name_with_type,
          code: e.code,
        })) as any);

    // return response.data;
  },
  function (error) {
    // throw error;

    // if (error?.response?.status !== 304)
    return Promise.reject(error);
  }
);

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
  async getProvinces(countryCode?: unknown): Promise<Location3rd[]> {
    try {
      const data = await fetcher.get<never, FetchData>("/provinces/getAll?limit=-1");

      return data;
    } catch (error) {
      return [];
    }
  }

  // Huyện/Thị xã/Thành phố
  async getDistricts(provinceCode?: unknown): Promise<Location3rd[]> {
    try {
      const url =
        typeof provinceCode === "string" && provinceCode
          ? //
            `/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
          : `/districts/getAll`;
      const data = await fetcher.get<never, FetchData>(url);

      return data;
    } catch (error) {
      return [];
    }
  }

  // Xã/Phường/Thị trấn
  async getWards(districtCode?: unknown): Promise<Location3rd[]> {
    try {
      const url =
        typeof districtCode === "string" && districtCode
          ? //
            `/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
          : `/wards/getAll`;
      const data = await fetcher.get<never, FetchData>(url);

      return data;
    } catch (error) {
      return [];
    }
  }

  async resolveProvince(value: string): Promise<Location3rd | null> {
    try {
      const url = `/provinces/getAll?q=${value}&cols=name,name_with_type`;
      const data = await fetcher.get<never, FetchData>(url);

      return data.length ? data[0] : null;
    } catch (error) {
      return null;
    }
  }
  async resolveDistrict(value: string): Promise<Location3rd | null> {
    try {
      const url = `/districts/getAll?q=${value}&cols=name,name_with_type`;
      const data = await fetcher.get<never, FetchData>(url);

      return data.length ? data[0] : null;
    } catch (error) {
      return null;
    }
  }
  async resolveWard(value: string): Promise<Location3rd | null> {
    try {
      const url = `/wards/getAll?q=${value}&cols=name,name_with_type`;
      const data = await fetcher.get<never, FetchData>(url);

      return data.length ? data[0] : null;
    } catch (error) {
      return null;
    }
  }
}

export default new Location3rdVNService();
