export const checkObjectKeys = (object: any = {}) => {
  const obj = { ...object };
  let result = true;
  for (let key in obj) {
    if (obj[key] !== 0 && (obj[key] === null || obj[key] === '')) {
      result = false;
    }
  }
  return result;
};
