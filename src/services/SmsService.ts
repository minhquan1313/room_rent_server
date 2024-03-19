import { Twilio } from "twilio";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";

class SmsService {
  CLIENT: Twilio;

  VERIFY_ID: string;
  // -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  constructor() {
    const { TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_ID } = process.env;
    if (!TWILIO_ACCOUNT_ID) throw new Error(`Missing TWILIO_ACCOUNT_ID`);
    if (!TWILIO_AUTH_TOKEN) throw new Error(`Missing TWILIO_AUTH_TOKEN`);
    if (!TWILIO_VERIFY_ID) throw new Error(`Missing TWILIO_VERIFY_ID`);

    this.CLIENT = new Twilio(TWILIO_ACCOUNT_ID, TWILIO_AUTH_TOKEN);
    this.VERIFY_ID = TWILIO_VERIFY_ID;
  }

  makeVerifyCode(tel: string) {
    return new Promise<VerificationInstance>((rs, rj) => {
      this.CLIENT.verify.v2
        .services(this.VERIFY_ID)
        .verifications.create({
          to: tel,
          channel: "sms",
        })
        .then(rs)
        .catch((error) => {
          console.log(`🚀 ~ SmsService ~ makeVerifyCode ~ error:`, error);

          rj(error);
        });
    });
  }
  verifyCode(ofTel: string, code: string) {
    return new Promise<VerificationCheckInstance>((rs, rj) => {
      this.CLIENT.verify.v2
        .services(this.VERIFY_ID)
        .verificationChecks.create({ to: ofTel, code })
        .then((verification_check) => {
          console.log(`🚀 ~ SmsService ~ .then ~ verification_check:`, verification_check);

          rs(verification_check);
        })
        .catch((error) => {
          console.log(error.status);

          rj(error);
        });
    });
  }
}

export default new SmsService();
