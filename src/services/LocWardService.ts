import logger from "@/Utils/logger";
import { Ward } from "@/models/Location/Ward";
import { Location3rd } from "@/types/Location3rd";

// re write this
class LocWardService {
  async getList(districtCode?: unknown): Promise<Location3rd[]> {
    if (typeof districtCode !== "string") return [];

    try {
      const data = await Ward.find({
        district_code: districtCode,
      });

      const formatted: Location3rd[] = data.map((v) => ({
        code: v.code,
        name: v.full_name,
      }));

      return formatted;
    } catch (error) {
      logger(`🚀 ~ file: LocDistrictService.ts:23 ~ LocDistrictService ~ getList ~ error:`, error);

      return [];
    }
  }

  async resolve(value: string, districtCode: string): Promise<Location3rd | null> {
    try {
      const result = await Ward.find({
        $text: { $search: value },
        district_code: districtCode,
      });

      if (!result[0]) return null;
      const { code, full_name: name } = result[0];

      return { name, code };
    } catch (error) {
      logger(`🚀 ~ file: LocDistrictService.ts:37 ~ LocDistrictService ~ resolve ~ error:`, error);

      return null;
    }
  }
}

export default new LocWardService();
