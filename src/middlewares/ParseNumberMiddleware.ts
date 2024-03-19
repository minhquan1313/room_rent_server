import { queryParser } from "express-query-parser";

export const ParseNumberMiddleware = queryParser({
  parseNumber: true,
});
