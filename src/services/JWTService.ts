import jwt, { SignOptions } from "jsonwebtoken";

class JWTService {
  sign(data: string | object, options?: SignOptions) {
    const { PRIVATE_JWT_KEY } = process.env;
    if (!PRIVATE_JWT_KEY) throw new Error(`Missing PRIVATE_JWT_KEY`);

    const code = jwt.sign(data, PRIVATE_JWT_KEY, options);

    return code;
  }
  /**
   *
   * @param token
   * @returns May throw error, should have a catch(){}
   */
  verify(token: string) {
    const { PRIVATE_JWT_KEY } = process.env;
    if (!PRIVATE_JWT_KEY) throw new Error(`Missing PRIVATE_JWT_KEY`);
    return jwt.verify(token, PRIVATE_JWT_KEY);
  }
}

export default new JWTService();
