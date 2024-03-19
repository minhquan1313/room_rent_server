import { Location3rd } from "@/types/Location3rd";

// re write this
class LocCountryService {
  async getList(): Promise<Location3rd[]> {
    return [
      {
        code: "001",
        name: "Việt Nam",
      },
    ];
  }
}

export default new LocCountryService();
