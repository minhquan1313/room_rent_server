import { isProduction } from "@/Utils/isProduction";

type TLogger = {
  (...s: unknown[]): void;
  error: (...s: unknown[]) => void;
};

const logger: TLogger = (() => {
  if (isProduction) {
    const temp = () => {};
    temp.error = () => {};
    return temp;
  }

  const v = (...s: unknown[]) => console.log(...s);
  v.error = (...s: unknown[]) => console.error(...s);

  return v;
})();

export default logger;
