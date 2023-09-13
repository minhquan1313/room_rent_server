import { RoomLocation } from "@/models/Room/RoomLocation";

export type LocationSearchQuery = {
  country?: string;
  district?: string;
  ward?: string;
};
class RoomLocationService {
  async getExistCountries() {
    return await RoomLocation.find({}, "country").distinct<string>("country");
  }
  async getExistProvinces() {
    return await RoomLocation.find({}, "province").distinct<string>("province");
  }
  async getExistDistricts() {
    return await RoomLocation.find({}, "district").distinct<string>("district");
  }
  async getExistWards() {
    return await RoomLocation.find({}, "ward").distinct<string>("ward");
  }

  async getProvinceBaseOnCountry(country: string) {
    let l = await RoomLocation.find({ country }, "province").distinct("province");
    console.log(`🚀 ~ RoomLocationService ~ getProvinceBaseOnCountry ~ l:`, l);

    return l as string[];
  }
  async getDistrictsBaseOnProvince(province: string) {
    let l = await RoomLocation.find({ province }, "district").distinct("district");
    console.log(`🚀 ~ RoomLocationService ~ getProvinceBaseOnCountry ~ l:`, l);

    return l as string[];
  }
  async getWardBaseOnDistrict(district: string) {
    let l = await RoomLocation.find({ district }, "ward").distinct("ward");
    console.log(`🚀 ~ RoomLocationService ~ getProvinceBaseOnCountry ~ l:`, l);

    return l as string[];
  }
}

export default new RoomLocationService();
