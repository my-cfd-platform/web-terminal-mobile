export const getNumberSign = (value: number) => {
  return value > 0 ? '+' : value === 0 ? '' : '-';
};

export const getNumberSignNegative = (value: number) => {
  return value > 0 ? '' : value === 0 ? '' : '-';
};
