import { IDistrict, IProvince } from "@/types/TProvince";
import axios from "axios";

//Cấp tỉnh: Tỉnh / Thành phố trực thuộc trung ương
//Cấp huyện: Quận / Huyện / Thị xã / Thành phố thuộc tỉnh / Thành phố thuộc thành phố trực thuộc trung ương
//Cấp xã: Xã / Phường / Thị trấn.
const instance = axios.create({
  baseURL: "https://provinces.open-api.vn/api",
});

class ProvinceService {
  // Tỉnh/Thành phố
  async getProvinces() {
    const data = await instance.get<IProvince[]>("/");

    return data.data;
  }

  // Huyện/Thị xã/Thành phố
  async getDistricts(provinceCode: number) {
    const data = await instance.get<IProvince>(`/p/${provinceCode}?depth=2`);

    return data.data.districts;
  }

  // Xã/Phường/Thị trấn
  async getWards(districtCode: number) {
    const data = await instance.get<IDistrict>(`/d/${districtCode}?depth=2`);

    return data.data.wards;
  }
}

export default new ProvinceService();
