export const ToLowerCaseKeys = (object: object) => {
  const lowerCaseKeys = Object.keys(object).reduce((acc, key) => {
    acc[key.toLowerCase()] = object[key];
    return acc;
  }, {});
  return lowerCaseKeys;
};
