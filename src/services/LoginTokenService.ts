import { LoginToken } from "@/models/User/LoginToken";
import { User } from "@/models/User/User";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export interface ITokenParam {
  username: string;
  userId?: string;
}

export interface ITokenRawParam {
  userId: string | Types.ObjectId;
  token: string;
}

class LoginTokenService {
  /**
   *
   * @param param0 provide userId to auto create in database
   * @returns
   */
  async makeToken({ username, userId }: ITokenParam) {
    if (!process.env.PRIVATE_JWT_KEY) throw new Error("PRIVATE_JWT_KEY missing");
    const token = jwt.sign(
      {
        username,
        createdAt: new Date().getTime(),
      },
      process.env.PRIVATE_JWT_KEY
    );

    if (userId) {
      const date = this.getTokenDefaultExpire();

      await LoginToken.create({ token, user: userId, expire: date });
    }

    return token;
  }
  async makeTokenRaw({ token, userId }: ITokenRawParam) {
    const date = this.getTokenDefaultExpire();

    await LoginToken.create({ token, user: userId, expire: date });

    return token;
  }
  // verify(token: string) {
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
    const date = this.getTokenDefaultExpire();

    await LoginToken.updateOne(
      {
        token,
      },
      { expire: date }
    );
  }

  getTokenDefaultExpire() {
    // default will be 30
    const date = new Date();
    date.setDate(date.getDate() + 30);
    date.setSeconds(date.getSeconds() + 3);

    return date;
  }

  async getUserByToken(token: string) {
    const loginToken = await LoginToken.findOne({ token });

    if (!loginToken || loginToken.user === null) return null;

    const user = await User.findOne(loginToken.user);

    return user;
  }
}

export default new LoginTokenService();
