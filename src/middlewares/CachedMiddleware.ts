import { NextFunction, Request, Response } from "express";
import cache from "memory-cache";

export interface ResponseCached extends Response {
  sendResponse?: Response["send"];
  // send(body: any): void;
}

type CachedParams = {
  key_?: string;
  duration?: number;
};
const DEFAULT_CACHE_TIME = 60000; //ms

export const CachedMiddleware = ({ key_, duration = DEFAULT_CACHE_TIME }: CachedParams = {}) => {
  return (req: Request, res: ResponseCached, next: NextFunction) => {
    // return next();
    const key = key_ || "__express__" + req.originalUrl || req.url;

    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      res.sendResponse = res.send;
      (res as any).send = (body: any) => {
        cache.put(key, body, duration); // duration tính bằng giây
        console.log(`🚀 ~ CachedMiddleware ~ key:`, key);

        res.sendResponse!(body);
      };
      next();
    }
  };
};

export type RequestCacheClear = Request & {
  keyToClear?: string;
};
// export const CachedMiddlewareClearKey = (req: RequestCacheClear, res: Response, next: NextFunction) => {
//   const { keyToClear } = req;

//   req.params
//   if (!keyToClear) return;

//   cache.keys().forEach((key: string) => {
//     if (!key.toLocaleLowerCase().includes(keyToClear)) return;

//     cache.del(key);
//   });
// };
