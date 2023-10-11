import { LoginToken } from "@/models/User/LoginToken";
import { User } from "@/models/User/User";
import JWTService from "@/services/JWTService";
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
   * @param param0 thêm userId để tạo document trong database
   * @returns
   */
  async makeToken({ username, userId }: ITokenParam) {
    const token = JWTService.sign({
      username,
      createdAt: new Date().getTime(),
    });

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
    const token = JWTService.sign(password);

    return token;
  }
  comparePassword(rawTypePassword?: string, encryptedPassword?: string) {
    if (!rawTypePassword || !encryptedPassword) return false;

    const p = this.encodePassword(rawTypePassword);

    return p === encryptedPassword;
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
    // default will be 30 days
    const date = new Date();
    date.setDate(date.getDate() + 30);
    // date.setSeconds(date.getSeconds() + 3);

    return date;
  }

  async getUserByToken(token: string) {
    const loginToken = await LoginToken.findOne({ token });

    if (!loginToken || loginToken.user === null) return null;

    const user = await User.findOne(loginToken.user);

    return user;
  }

  async getUserByTokenAndLean(token: string) {
    const loginToken = await LoginToken.findOne({ token });

    if (!loginToken || loginToken.user === null) return null;

    const user = await User.findOne(loginToken.user).lean();

    return user;
  }
}

export default new LoginTokenService();
