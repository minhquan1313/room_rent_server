import { PhoneNumber } from "@/models/User/PhoneNumber";
import { PhoneNumberFormat, PhoneNumberUtil } from "google-libphonenumber";

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

  async create(phone: string | number, region_code: string) {
    if (!this.isValid(phone, region_code)) return null;

    const number = phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code);

    const code = phoneUtil.getRegionCodeForNumber(number);
    const e164_format = phoneUtil.format(number, PhoneNumberFormat.E164);
    const country_code = number.getCountryCode();
    // const national_number = phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
    const national_number = number.getNationalNumber();

    const phoneNumber = await PhoneNumber.create({
      region_code: code,
      e164_format,
      country_code,
      national_number,
    });

    return phoneNumber;
  }
  format(phone: string | number, region_code: string) {
    const number = phoneUtil.parse(typeof phone === "string" ? phone : phone.toString(), region_code);

    return phoneUtil.format(number, PhoneNumberFormat.NATIONAL);
  }
}

export default new PhoneService();
