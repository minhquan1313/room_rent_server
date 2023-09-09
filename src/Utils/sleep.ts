export function sleep(ms = 0) {
  return new Promise<void>((r) => {
    setTimeout(() => {
      r();
    }, ms);
  });
}
