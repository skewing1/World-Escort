import countriesData from './countries.json';

export interface Country {
  code: string;
  name: string;
  flag: string;
  lat: number | undefined;
  lng: number | undefined;
}

export const COUNTRIES: Country[] = countriesData.map(country => ({
  code: country.isoAlpha3,
  name: country.name,
  flag: `data:image/png;base64,${country.flag}`,
  lat: country.lat,
  lng: country.lng
}));

export function getCountryFlag(codeOrName: string): string {
  if (!codeOrName) return '🏳️';
  const country = COUNTRIES.find(
    c => c.code === codeOrName || c.name.toLowerCase() === codeOrName.toLowerCase()
  );
  return country ? country.flag : '🏳️';
}

export function getCountryName(code: string): string {
  const country = COUNTRIES.find(c => c.code === code);
  return country ? country.name : code;
}

export function getCountryData(codeOrName: string): Country | undefined {
  return COUNTRIES.find(
    (c) =>
      c.code === codeOrName ||
      c.name.toLowerCase() === codeOrName.toLowerCase(),
  );
}