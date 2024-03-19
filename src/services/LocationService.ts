import logger from "@/Utils/logger";
import { removeAccents } from "@/Utils/removeAccents";
import { RoomLocation } from "@/models/Room/RoomLocation";
import LocCountryService from "@/services/LocCountryService";
import LocDistrictService from "@/services/LocDistrictService";
import LocProvinceService from "@/services/LocProvinceService";
import LocWardService from "@/services/LocWardService";
import { Location3rd } from "@/types/Location3rd";

export type LocationSearchQuery = {
  country?: unknown;
  province?: unknown;
  district?: unknown;
  ward?: unknown;

  all?: unknown;
};

// re write this
class LocationService {
  async getCountries(d: LocationSearchQuery = {}) {
    let { all } = d;
    let results: string[] | Location3rd[] = [];

    if (all === undefined) {
      results = await RoomLocation.find({}, "country").distinct("country");
    } else {
      // if (typeof country === "string") {
      // const n = parseInt(country);
      results = await LocCountryService.getList();
      // }
    }
    return results;
  }
  async getProvinces(d: LocationSearchQuery = {}) {
    let { country, all } = d;
    logger(`🚀 ~ file: LocationService.ts:37 ~ LocationService ~ getProvinces ~ d:`, d);

    let results: string[] | Location3rd[] = [];
    if (all === undefined) {
      results = await RoomLocation.find(typeof country !== "string" ? {} : { country }, "province")
        .sort({
          province: 1,
        })
        .distinct("province");
    } else {
      results = await LocProvinceService.getList(country);
    }

    return results;
  }
  async getDistricts(d: LocationSearchQuery = {}) {
    let { province, all } = d;

    let results: string[] | Location3rd[] = [];
    if (all === undefined) {
      results = (
        await RoomLocation.find(typeof province !== "string" ? {} : { province }, "district")
          .sort({
            district: 1,
          })
          .distinct("district")
      ).filter((v) => v !== undefined) as string[];
    } else {
      results = await LocDistrictService.getList(province);
    }

    return results;
  }
  async getWards(d: LocationSearchQuery = {}) {
    let { district, all } = d;

    let results: string[] | Location3rd[] = [];
    if (all === undefined) {
      results = (
        await RoomLocation.find(typeof district !== "string" ? {} : { district }, "ward")
          .sort({
            ward: 1,
          })
          .distinct("ward")
      ).filter((v) => v !== undefined) as string[];
    } else {
      results = await LocWardService.getList(district);
    }

    return results;
  }
  async resolve(d: LocationSearchQuery = {}) {
    let { country, province, district, ward } = d;
    console.log(`🚀 ~ RoomLocationService ~ resolve ~ d:`, d);

    if (!country || typeof country !== "string") return {};

    let result: { [k in keyof Omit<LocationSearchQuery, "all">]: Location3rd } = {};

    switch (removeAccents(country.toLowerCase())) {
      case "viet nam":
        const c = (await this.getCountries({ all: true }))[0] as Location3rd;

        if (c) {
          result["country"] = c;
        }

        let code = result["country"]?.code;

        if (code && typeof province === "string") {
          // find district
          const province3rd = await LocProvinceService.resolve(province, code);
          logger(`🚀 ~ file: LocationService.ts:111 ~ LocationService ~ resolve ~ province3rd:`, province3rd);

          if (province3rd) {
            result["province"] = province3rd;
          }
        }
        code = result["province"]?.code;

        if (code && typeof district === "string") {
          // find ward
          const district3rd = await LocDistrictService.resolve(district, code);
          logger(`🚀 ~ file: LocationService.ts:123 ~ LocationService ~ resolve ~ district3rd:`, district3rd);

          if (district3rd) {
            result["district"] = district3rd;
          }
        }
        code = result["district"]?.code;

        if (code && typeof ward === "string") {
          // find ward
          const ward3rd = await LocWardService.resolve(ward, code);
          logger(`🚀 ~ file: LocationService.ts:133 ~ LocationService ~ resolve ~ ward3rd:`, ward3rd);

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
}

export default new LocationService();
