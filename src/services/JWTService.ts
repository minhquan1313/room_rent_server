import jwt, { SignOptions } from "jsonwebtoken";

class JWTService {
  PRIVATE_JWT_KEY: string;

  constructor() {
    const { PRIVATE_JWT_KEY } = process.env;
    if (!PRIVATE_JWT_KEY) throw new Error(`Missing PRIVATE_JWT_KEY`);
    this.PRIVATE_JWT_KEY = PRIVATE_JWT_KEY;
  }

  sign(data: string | object, options?: SignOptions) {
    const code = jwt.sign(data, this.PRIVATE_JWT_KEY, options);

    return code;
  }
  /**
   *
   * @param token
   * @returns May throw error, should have a catch(){}
   */
  verify(token: string) {
    return jwt.verify(token, this.PRIVATE_JWT_KEY);
  }
}

export default new JWTService();
