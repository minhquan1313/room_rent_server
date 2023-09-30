import { Email } from "@/models/User/Email";
import JWTService from "@/services/JWTService";
import { createTransport } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export interface TSaveRoomPayload {
  room: string;
}

class MailService {
  async send(d: { email: string; subject: string; content: string }) {
    return new Promise<SMTPTransport.SentMessageInfo>((rs, rj) => {
      const { email, content, subject } = d;
      const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;

      if (!EMAIL_ADDRESS) throw new Error(`Missing EMAIL_ADDRESS`);
      if (!EMAIL_PASSWORD) throw new Error(`Missing EMAIL_PASSWORD`);

      const transporter = createTransport({
        // config mail server
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: EMAIL_ADDRESS, //Tài khoản gmail vừa tạo
          pass: EMAIL_PASSWORD, //Mật khẩu tài khoản gmail vừa tạo
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      });

      // let content = "";
      // content += `
      //     <div style="padding: 10px; background-color: #003375">
      //         <div style="padding: 10px; background-color: white;">
      //             <h4 style="color: #0085ff">Gửi mail với nodemailer và express</h4>
      //             <span style="color: black">Đây là mail test</span>
      //         </div>
      //     </div>
      // `;
      const mainOptions = {
        // thiết lập đối tượng, nội dung gửi mail
        from: "NQH-Test nodemailer",
        to: email,
        subject,
        //   text: "Your text is here", //Thường thi mình không dùng cái này thay vào đó mình sử dụng html để dễ edit hơn
        html: content, //Nội dung html mình đã tạo trên kia :))
      };
      transporter.sendMail(mainOptions, function (err, info) {
        console.log(`🚀 ~ MailService ~ info:`, info);

        if (err) {
          console.log(`🚀 ~ MailService ~ err:`, err);
          return rj(err);
          // req.flash("mess", "Lỗi gửi mail: " + err); //Gửi thông báo đến người dùng
          // res.redirect("/");
        } else {
          return rs(info);
          // console.log("Message sent: " + info.response);
          // req.flash("mess", "Một email đã được gửi đến tài khoản của bạn"); //Gửi thông báo đến người dùng
          // res.redirect("/");
        }
      });
    });
  }

  sendEmailVerifyCode(d: { email: string; code: string }) {
    const { code, email } = d;
    const { FRONT_END_URL } = process.env;
    if (!FRONT_END_URL) throw new Error(`Missing FRONT_END_URL`);

    const url = `${FRONT_END_URL}/verify?type=email&code=${code}`;

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
}

export default new MailService();
