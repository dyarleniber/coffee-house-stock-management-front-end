export const objectForEach = (object, fn) => {
  Object.keys(object).forEach((key) => {
    fn(key, object[key]);
  });
};
