import { removeAccents } from "@/Utils/removeAccents";
import { RoomLocation } from "@/models/Room/RoomLocation";
import Location3rdVNService from "@/services/Location3rdVNService";
import { Location3rd } from "@/types/Location3rd";

export type LocationSearchQuery = {
  country?: unknown;
  province?: unknown;
  district?: unknown;
  ward?: unknown;

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

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find(typeof country !== "string" ? {} : { country }, "province")
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

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find(typeof province !== "string" ? {} : { province }, "district")
        .sort({
          district: 1,
        })
        .distinct("district");
    } else {
      // if (typeof province === "string") {
      results = await Location3rdVNService.getDistricts(province);
      // }
    }

    return results;
  }
  async getWards(d: LocationSearchQuery = {}) {
    let { district, all } = d;

    let results: (string | Location3rd)[] = [];
    if (all === undefined) {
      results = await RoomLocation.find(typeof district !== "string" ? {} : { district }, "ward")
        .sort({
          ward: 1,
        })
        .distinct("ward");
    } else {
      // if (typeof district === "string") {
      results = await Location3rdVNService.getWards(district);
      // }
    }

    return results;
  }
  async resolve(d: LocationSearchQuery = {}) {
    let { country, province, district, ward } = d;
    console.log(`🚀 ~ RoomLocationService ~ resolve ~ d:`, d);

    if (!country || typeof country !== "string") return {};

    let result: {
      [k in keyof Omit<LocationSearchQuery, "all">]: Location3rd;
    } = {};

    switch (removeAccents(country.toLowerCase())) {
      case "viet nam":
        const c = (await Location3rdVNService.getCountries())[0];

        if (c) {
          result["country"] = c;
        }

        if (province && typeof province === "string") {
          // find district
          const province3rd = await Location3rdVNService.resolveProvince(province);
          console.log(`🚀 ~ RoomLocationService ~ resolve ~ province3rd:`, province3rd);

          if (province3rd) {
            result["province"] = province3rd;
          }
        }

        if (district && typeof district === "string") {
          // find ward
          const district3rd = await Location3rdVNService.resolveDistrict(district);
          console.log(`🚀 ~ RoomLocationService ~ resolve ~ district3rd:`, district3rd);

          if (district3rd) {
            result["district"] = district3rd;
          }
        }

        if (ward && typeof ward === "string") {
          // find ward
          const ward3rd = await Location3rdVNService.resolveWard(ward);
          console.log(`🚀 ~ RoomLocationService ~ resolve ~ ward3rd:`, ward3rd);

          if (ward3rd) {
            result["ward"] = ward3rd;
          }
        }

        break;

      default:
        return {};
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
