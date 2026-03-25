// removeDiacritics — normalizeaza un string eliminand diacriticele romanesti si alte accente.
// Util pentru cautari case-insensitive fara diacritice (ex: "Musetel" gaseste "Musatel").

const DIACRITICS_MAP: Record<string, string> = {
  '\u0103': 'a', '\u00E2': 'a', '\u00EE': 'i', '\u0219': 's', '\u015F': 's',
  '\u021B': 't', '\u0163': 't',
  '\u0102': 'A', '\u00C2': 'A', '\u00CE': 'I', '\u0218': 'S', '\u015E': 'S',
  '\u021A': 'T', '\u0162': 'T',
};

const DIACRITICS_REGEX = new RegExp(Object.keys(DIACRITICS_MAP).join('|'), 'g');

export function removeDiacritics(str: string): string {
  return str.replace(DIACRITICS_REGEX, (match) => DIACRITICS_MAP[match] ?? match);
}
