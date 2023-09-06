import { RoomLocation } from "@/models/Room/RoomLocation";

class RoomLocationService {
  async getExistProvinces() {
    return await RoomLocation.find({}, "province").distinct<string>("province");
  }
  async getExistDistricts() {
    return await RoomLocation.find({}, "district").distinct<string>("district");
  }
  async getExistWards() {
    return await RoomLocation.find({}, "ward").distinct<string>("ward");
  }
}

export default new RoomLocationService();
