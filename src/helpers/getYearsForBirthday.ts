export const getYearsForBday = () => {
  const years = [];

  for (let i = new Date().getFullYear(); i > 1900; i--) {
    years.push(i.toString());
  }

  return years;
};
