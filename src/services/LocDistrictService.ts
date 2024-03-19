import logger from "@/Utils/logger";
import { District } from "@/models/Location/District";
import { Location3rd } from "@/types/Location3rd";

// re write this
class LocDistrictService {
  async getList(provinceCode?: unknown): Promise<Location3rd[]> {
    if (typeof provinceCode !== "string") return [];

    try {
      const data = await District.find({
        province_code: provinceCode,
      }).lean();

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

  async resolve(value: string, provinceCode: string): Promise<Location3rd | null> {
    try {
      const result = await District.find({
        $text: { $search: value },
        province_code: provinceCode,
      }).lean();

      if (!result[0]) return null;

      const { code, full_name: name } = result[0];

      return { name, code };
    } catch (error) {
      logger(`🚀 ~ file: LocDistrictService.ts:37 ~ LocDistrictService ~ resolve ~ error:`, error);

      return null;
    }
  }
}

export default new LocDistrictService();
