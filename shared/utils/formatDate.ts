// formatDate — functie care primeste un ISO string si returneaza data formatata in romana.
// Exemplu: "2025-06-15T..." => "15 iunie 2025". Folosita in callout-uri si detalii POI.

const months = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
];

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
