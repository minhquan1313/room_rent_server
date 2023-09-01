import { PhoneNumber } from "@/models/User/PhoneNumber";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { Types } from "mongoose";

const phoneUtil = PhoneNumberUtil.getInstance();

class PhoneService {
  isValid(phone: string | number, region_code: string) {
    try {
      const valid = phoneUtil.isValidNumber(phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code));

      return valid;
    } catch (error) {
      return false;
    }
  }

  createInstance(phone: string | number, region_code: string) {
    if (!this.isValid(phone, region_code)) return null;

    const number = phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code);

    const code = phoneUtil.getRegionCodeForNumber(number);
    const e164_format = phoneUtil.format(number, PhoneNumberFormat.E164);
    const country_code = number.getCountryCode();
    const national_number = number.getNationalNumber();

    return { region_code: code, e164_format, country_code, national_number };
  }

  async create(userId: string | Types.ObjectId, phone: string | number, region_code: string, _id?: string) {
    const i = this.createInstance(phone, region_code);
    if (!i) return null;

    const phoneNumber = await PhoneNumber.create({
      ...i,
      user: userId,
      _id,
    });

    return phoneNumber;
  }
  async findOne(phone: Types.ObjectId | string | number) {
    // phone param could be string id
    const phoneNumber = await PhoneNumber.findOne({
      $or: [
        {
          e164_format: phone,
        },
        {
          national_number: typeof phone === "number" ? phone : typeof phone === "string" ? parseInt(phone) : undefined,
        },
        {
          _id: typeof phone === "object" ? phone : undefined,
        },
      ],
    });

    return phoneNumber;
  }
  async update(oldPhone: string | number, phone: string | number, region_code: string) {
    const old = await this.findOne(oldPhone);
    if (old) {
      const i = this.createInstance(phone, region_code);
      if (!i) return null;

      await old.updateOne(i);
    } else return null;

    return old;
  }
  async delete(phone: string | number) {
    await PhoneNumber.deleteOne({
      $or: [
        {
          e164_format: phone,
        },
        {
          national_number: typeof phone === "number" ? phone : parseInt(phone),
        },
      ],
    });

    return true;
  }
  format(phone: string | number, region_code: string) {
    const number = phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code);

    return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
  }
}

export default new PhoneService();
