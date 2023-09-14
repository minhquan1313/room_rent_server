import { RoomLocation } from "@/models/Room/RoomLocation";
import Location3rdVNService from "@/services/Location3rdVNService";
import { Location3rd } from "@/types/Location3rd";

export type LocationSearchQuery = {
  country?: string;
  province?: string;
  district?: string;
  ward?: string;

  all?: unknown;
};
class RoomLocationService {
  async getCountries(d: LocationSearchQuery = {}) {
    let { all } = d;
    let results = [];

    if (all === undefined) {
      results = await RoomLocation.find({}, "country").distinct("country");
    } else {
      // if (typeof country === "string") {
      // const n = parseInt(country);
      // if (n) results = await Location3rdVNService.getProvinces(n);
      results = await Location3rdVNService.getCountries();
      // }
    }
    return results;
  }
  async getProvinces(d: LocationSearchQuery = {}) {
    let { country, all } = d;

    if (typeof country !== "string") country = undefined;

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find({ country }, "province")
        .sort({
          province: 1,
        })
        .distinct("province");
    } else {
      // if (typeof country === "string") {
      // const n = parseInt(country);
      // if (n) results = await Location3rdVNService.getProvinces(n);
      results = await Location3rdVNService.getProvinces();
      // }
    }

    return results;
  }
  async getDistricts(d: LocationSearchQuery = {}) {
    let { province, all } = d;
    if (typeof province !== "string") province = undefined;

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find({ province }, "district")
        .sort({
          district: 1,
        })
        .distinct("district");
    } else {
      if (typeof province === "string") {
        const n = parseInt(province);
        if (n) results = await Location3rdVNService.getDistricts(n);
      }
    }

    return results;
  }
  async getWards(d: LocationSearchQuery = {}) {
    let { district, all } = d;
    if (typeof district !== "string") district = undefined;

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find({ district }, "ward")
        .sort({
          ward: 1,
        })
        .distinct("ward");
    } else {
      if (typeof district === "string") {
        const n = parseInt(district);
        if (n) results = await Location3rdVNService.getWards(n);
      }
    }

    return results;
  }
  async resolve(d: LocationSearchQuery = {}) {
    let { province, district, ward } = d;

    let result: {
      [k in keyof LocationSearchQuery]: Location3rd;
    } = {};

    if (province) {
      // find district
      const province3rd = await Location3rdVNService.resolveProvince(province);
      console.log(`🚀 ~ RoomLocationService ~ resolve ~ province3rd:`, province3rd);

      if (province3rd) {
        result["province"] = province3rd;
      }
    }

    if (district) {
      // find ward
      const district3rd = await Location3rdVNService.resolveDistrict(district);
      if (district3rd) {
        result["district"] = district3rd;
      }
    }

    if (ward) {
      // find ward
      const ward3rd = await Location3rdVNService.resolveDistrict(ward);
      if (ward3rd) {
        result["ward"] = ward3rd;
      }
    }

    return result;
  }

  //   return results;
  // }
  // async resolveDistrict3rd(d: LocationSearchQuery = {}) {
  //   let { district, ward } = d;

  //   let results = [];
  //   if (all === undefined) {
  //     results = await RoomLocation.find({ district }, "ward")
  //       .sort({
  //         ward: 1,
  //       })
  //       .distinct("ward");
  //   } else {
  //     if (typeof district === "string") {
  //       const n = parseInt(district);
  //       if (n) results = await Location3rdVNService.getWards(n);
  //     }
  //   }

  //   return results;
  // }
}

export default new RoomLocationService();
