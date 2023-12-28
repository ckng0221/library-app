export function sleep(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve(true);
    }, timeout);
  });
}
