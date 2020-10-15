import metadata from '../assets/json/alpha2alpha3.json';

export const fromAlpha3ToAlpha2Code = (alpha3Code: string) => {
  const metaFound = metadata.find(
    (item: { [x: string]: string }) => item['3'] === alpha3Code
  );
  if (metaFound) {
    return metaFound['2'];
  }
};
