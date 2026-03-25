const months = [
  'ianuarie', 'februarie', 'martie', 'aprilie', 'mai', 'iunie',
  'iulie', 'august', 'septembrie', 'octombrie', 'noiembrie', 'decembrie',
];

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
