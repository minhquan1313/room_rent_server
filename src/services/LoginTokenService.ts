import { LoginToken } from "@/models/User/LoginToken";
import jwt from "jsonwebtoken";

export interface IEncodeParam {
  username: string;
  userId?: string;
}

class LoginTokenService {
  async makeToken({ username, userId }: IEncodeParam) {
    if (!process.env.PRIVATE_JWT_KEY) throw new Error("PRIVATE_JWT_KEY missing");

    const token = jwt.sign(
      {
        username,
        createdAt: new Date().getTime(),
      },
      process.env.PRIVATE_JWT_KEY
    );
    console.log(`🚀 ~ LoginTokenService ~ makeToken ~ token:`, token);

    console.log(`🚀 ~ LoginTokenService ~ makeToken ~ userId:`, userId);
    if (userId) {
      const date = new Date();
      date.setDate(date.getDate() + 30);

      await LoginToken.create({ token, user: userId, expire: date });
    }

    return token;
  }
  // verify(token: string) {
  //   if (!process.env.PRIVATE_JWT_KEY) throw new Error("PRIVATE_JWT_KEY missing");
  //   try {
  //     const check = jwt.verify(token, process.env.PRIVATE_JWT_KEY);

  //     return check;
  //   } catch (error) {
  //     console.log(`🚀 ~ LoginTokenService ~ verify ~ error:`, error);

  //     return false;
  //   }
  // }
  encodePassword(password: string) {
    if (!process.env.PRIVATE_JWT_KEY) throw new Error("PRIVATE_JWT_KEY missing");

    const token = jwt.sign(password, process.env.PRIVATE_JWT_KEY);

    return token;
  }

  async extendsTime(token: string) {
    const date = new Date();
    date.setDate(date.getDate() + 30);

    await LoginToken.updateOne(
      {
        token,
      },
      { expire: date }
    );
  }
}

export default new LoginTokenService();
