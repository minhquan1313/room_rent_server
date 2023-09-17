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
fetcher.interceptors.response.use(function (response) {
  const data = response.data as IWardResponse | IDistrictResponse | IProvinceResponse;

  return Array.isArray(data.data)
    ? []
    : (data.data.data.map((e) => ({
        name: e.name_with_type,
        code: e.code,
      })) as any);

  // return response.data;
});

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
  async getProvinces(countryCode?: string): Promise<Location3rd[]> {
    const data = await fetcher.get<never, FetchData>("/provinces/getAll?limit=-1");

    return data;
  }

  // Huyện/Thị xã/Thành phố
  async getDistricts(provinceCode?: string): Promise<Location3rd[]> {
    // if (provinceCode && !parseInt(provinceCode)) {
    //   const d = await this.resolveProvince(provinceCode);

    //   if (!d) return [];

    //   provinceCode = d.code;
    // }

    const url = provinceCode
      ? //
        `/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      : `/districts/getAll`;
    const data = await fetcher.get<never, FetchData>(url);

    return data;
  }

  // Xã/Phường/Thị trấn
  async getWards(districtCode?: string): Promise<Location3rd[]> {
    const url = districtCode
      ? //
        `/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      : `/getAll/getAll`;
    const data = await fetcher.get<never, FetchData>(url);

    return data;
  }

  async resolveProvince(value: string) {
    const url = `/provinces/getAll?q=${value}&cols=name,name_with_type`;
    const data = await fetcher.get<never, FetchData>(url);

    return data.length ? data[0] : null;
  }
  async resolveDistrict(value: string) {
    const url = `/districts/getAll?q=${value}&cols=name,name_with_type`;
    const data = await fetcher.get<never, FetchData>(url);

    return data.length ? data[0] : null;
  }
  async resolveWard(value: string) {
    const url = `/wards/getAll?q=${value}&cols=name,name_with_type`;
    const data = await fetcher.get<never, FetchData>(url);

    return data.length ? data[0] : null;
  }
}

export default new Location3rdVNService();
