export const calculateInPercent = (total: number, part: number, precision: number = 2) => {
  return ((part / total) * 100).toFixed(precision);
};
