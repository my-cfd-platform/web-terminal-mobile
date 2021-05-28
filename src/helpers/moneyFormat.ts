export const moneyFormat = (number: number) => {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export const moneyFormatPart = (number: number) => {
  const normalized = number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  return {
    full: normalized,
    int: normalized.toString().split('.')[0],
    decimal: normalized.toString().split('.')[1]
  }
}