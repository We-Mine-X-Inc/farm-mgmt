export function waitInMilliseconds<T>(millis) {
  return async (param: T): Promise<T> => {
    return new Promise<T>((resolve) => {
      setTimeout(() => resolve(param), millis);
    });
  };
}
