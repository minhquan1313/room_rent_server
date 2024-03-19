import logger from "@/Utils/logger";
import { Province } from "@/models/Location/Province";
import { Location3rd } from "@/types/Location3rd";

// re write this
class LocProvinceService {
  async getList(countryCode?: unknown): Promise<Location3rd[]> {
    if (typeof countryCode !== "string") return [];

    try {
      switch (countryCode) {
        case "001":
          const data = await Province.find().lean();

          const formatted: Location3rd[] = data.map((v) => ({
            code: v.code,
            name: v.full_name,
          }));

          return formatted;

        default:
          return [];
      }
    } catch (error) {
      logger(`🚀 ~ file: LocProvinceService.ts:19 ~ LocProvinceService ~ getList ~ error:`, error);

      return [];
    }
  }

  async resolve(value: string, countryCode: string): Promise<Location3rd | null> {
    try {
      switch (countryCode) {
        case "001":
          const result = await Province.find({
            $text: { $search: value },
          }).lean();

          if (!result[0]) return null;
          const { code, full_name: name } = result[0];
          return { name, code };
        default:
          return null;
      }
    } catch (error) {
      logger(`🚀 ~ file: LocProvinceService.ts:45 ~ LocProvinceService ~ resolve ~ error:`, error);

      return null;
    }
  }
}

export default new LocProvinceService();
