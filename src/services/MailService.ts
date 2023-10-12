import { Email, IEmail } from "@/models/User/Email";
import JWTService from "@/services/JWTService";
import { TCreateBody } from "@/types/TCommonQuery";
import { Types } from "mongoose";
import { Transporter, createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface TSaveRoomPayload {
  room: string;
}

class MailService {
  transporter: Transporter<SMTPTransport.SentMessageInfo>;
  FRONT_END_URL: string;

  constructor() {
    const { EMAIL_ADDRESS, EMAIL_PASSWORD, FRONT_END_URL } = process.env;
    if (!EMAIL_ADDRESS) throw new Error(`Missing EMAIL_ADDRESS`);
    if (!EMAIL_PASSWORD) throw new Error(`Missing EMAIL_PASSWORD`);
    if (!FRONT_END_URL) throw new Error(`Missing FRONT_END_URL`);

    this.transporter = createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    this.FRONT_END_URL = FRONT_END_URL;
  }

  async send(d: { email: string; subject: string; content: string }) {
    return new Promise<SMTPTransport.SentMessageInfo>((rs, rj) => {
      const { email, content, subject } = d;

      const mainOptions = {
        to: email,
        subject,
        html: content,
      };
      this.transporter.sendMail(mainOptions, function (err, info) {
        console.log(`🚀 ~ MailService ~ info:`, info);

        if (err) {
          console.log(`🚀 ~ MailService ~ err:`, err);
          return rj(err);
        } else {
          return rs(info);
        }
      });
    });
  }

  sendEmailVerifyCode(d: { email: string; code: string }) {
    const { code, email } = d;

    const url = `${this.FRONT_END_URL}/verify?type=email&code=${code}`;

    return this.send({
      email,
      subject: `Xác minh ${email}`,
      content: `
      <div style="font-size: 1rem;">
      <div>Room Rent</div>
      Click vào đây để xác minh email
      <a
        href="${url}"
        target="_blank"
        rel="noopener noreferrer">
        ${url}
      </a>
    </div>`,
    });
  }

  makeVerifyCode(email: string) {
    const token = JWTService.sign(
      {
        email,
      },
      {
        expiresIn: "1d",
      }
    );

    return token;
  }
  /**
   * @param code
   * @returns May throw error of expired
   */
  async verifyCode(code: string) {
    const { email } = JWTService.verify(code) as { email: string };
    if (!email) return false;

    const doc = await Email.findOne({ email });
    if (!doc) return false;

    doc.verified = true;
    await doc.save();

    return true;
  }

  async deleteEmail(mailId: string) {
    await Email.deleteOne({ _id: mailId });
  }
  async createEmail(newData: TCreateBody<IEmail>) {
    const doc = await Email.create(newData);

    return doc;
  }
  async updateEmail(mailId: string | Types.ObjectId, newData: Partial<IEmail>) {
    const doc = await Email.findOne({ _id: mailId });
    if (!doc) return false;

    // if (newData.email === "") {
    //   await doc.deleteOne();
    //   return true;
    // }

    await doc.updateOne(newData);
    return true;
  }
}

export default new MailService();
