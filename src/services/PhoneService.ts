import { PhoneNumber, PhoneNumberDocument } from "@/models/User/PhoneNumber";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";
import { Types } from "mongoose";

const phoneUtil = PhoneNumberUtil.getInstance();

class PhoneService {
  isValid(phone: string | number, region_code: string) {
    console.log("3");

    try {
      const valid = phoneUtil.isValidNumber(phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code));
      console.log("3");

      return valid;
    } catch (error) {
      console.log("3f");
      return false;
    }
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

    return phoneNumber as PhoneNumberDocument | null;
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

  async create({ userId, phone, region_code, _id, valid }: { userId: string | Types.ObjectId; phone: string | number; region_code: string; _id?: string; valid?: boolean }) {
    const i = this.createInstance(phone, region_code);
    if (!i) throw new Error(`Invalid phone number!`);

    const phoneNumber = await PhoneNumber.create({
      ...i,
      user: userId,
      _id,
      verified: valid,
    });

    return phoneNumber;
  }
  async update({ oldPhone, phone, region_code, valid }: { oldPhone: string | number | Types.ObjectId; phone: string | number; region_code: string; valid?: boolean }) {
    const old = await this.findOne(oldPhone);
    if (old) {
      const i = this.createInstance(phone, region_code);
      if (!i) return null;

      await old.updateOne({
        ...i,
        verified: valid,
      });
    } else return null;

    return old;
  }

  async updateValidId({ _id, valid }: { _id: string | Types.ObjectId; valid: boolean }) {
    const p = await PhoneNumber.findOne({ _id });

    if (p) {
      //
      await p.updateOne({ verified: valid });
    }
  }
  async updateValid(e164: string, valid: boolean) {
    const p = await PhoneNumber.findOne({ e164_format: e164 });

    if (p) {
      //
      await p.updateOne({ verified: valid });
    }
  }
  async delete(_id: string | Types.ObjectId) {
    await PhoneNumber.deleteOne({ _id });

    return true;
  }
  format(phone: string | number, region_code: string) {
    const number = phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code);

    return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
  }
}

export default new PhoneService();
