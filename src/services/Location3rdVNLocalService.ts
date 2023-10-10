import { binarySearch } from "@/Utils/binarySearch";
import { removeAccents } from "@/Utils/removeAccents";
import { vnDistrict, vnProvince, vnWard } from "@/constants/vnLocationData";
import { Location3rd } from "@/types/Location3rd";

class Location3rdVNLocalService {
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
      const data: Location3rd[] = vnProvince.map(({ code, name }) => ({
        code: String(code),
        name: name,
      }));

      return data;
    } catch (error) {
      console.log(`🚀 ~ Location3rdVNService ~ getProvinces ~ error:`, error);

      return [];
    }
  }

  // Huyện/Thị xã/Thành phố
  async getDistricts(provinceCode?: unknown): Promise<Location3rd[]> {
    try {
      if (typeof provinceCode === "number") {
        const index = binarySearch(vnProvince, ({ code }) => {
          return [code === provinceCode, code > provinceCode];
        });

        if (index === -1) return [];

        const data: Location3rd[] = vnProvince[index].districts.map(({ code, name }) => ({
          code: String(code),
          name: name,
        }));
        return data;
      } else {
        //
        return vnDistrict.map(({ code, name }) => ({
          code: String(code),
          name: name,
        }));
      }
    } catch (error) {
      console.log(`🚀 ~ Location3rdVNService ~ getDistricts ~ error:`, error);

      return [];
    }
  }

  // Xã/Phường/Thị trấn
  async getWards(districtCode?: unknown): Promise<Location3rd[]> {
    console.log(`🚀 ~ Location3rdVNLocalService ~ getWards ~ districtCode:`, districtCode);

    try {
      if (typeof districtCode === "number") {
        const index = binarySearch(vnDistrict, ({ code }) => {
          return [code === districtCode, code > districtCode];
        });

        if (index === -1) return [];

        const data: Location3rd[] = vnDistrict[index].wards.map(({ code, name }) => ({
          code: String(code),
          name: name,
        }));
        return data;
      } else {
        //
        return vnWard.map(({ code, name }) => ({
          code: String(code),
          name: name,
        }));
      }
    } catch (error) {
      console.log(`🚀 ~ Location3rdVNService ~ getWards ~ error:`, error);

      return [];
    }
  }

  async resolveProvince(value: string): Promise<Location3rd | null> {
    try {
      const v = removeAccents(value.trim());
      const data = vnProvince.find(({ name }) => removeAccents(name).includes(v));
      if (!data) return null;
      return { code: String(data.code), name: data.name };
    } catch (error) {
      return null;
    }
  }
  async resolveDistrict(value: string): Promise<Location3rd | null> {
    console.log(`🚀 ~ Location3rdVNLocalService ~ resolveDistrict ~ value:`, value);

    try {
      const v = removeAccents(value.trim());
      const data = vnDistrict.find(({ name }) => removeAccents(name).includes(v));
      if (!data) return null;
      return { code: String(data.code), name: data.name };
    } catch (error) {
      return null;
    }
  }
  async resolveWard(value: string): Promise<Location3rd | null> {
    try {
      const v = removeAccents(value.trim());
      const data = vnWard.find(({ name }) => removeAccents(name).includes(v));
      if (!data) return null;
      return { code: String(data.code), name: data.name };
    } catch (error) {
      return null;
    }
  }
}

export default new Location3rdVNLocalService();
