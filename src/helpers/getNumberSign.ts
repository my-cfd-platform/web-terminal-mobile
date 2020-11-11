export const getNumberSign = (value: number) => {
  return value > 0 ? '+' : value === 0 ? '' : '-';
};
