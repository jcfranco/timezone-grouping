const continentAllowList = new Set([
  'Europe',
  'Asia',
  'America',
  'America/Argentina',
  'Africa',
  'Australia',
  'Pacific',
  'Atlantic',
  'Antarctica',
  'Arctic',
  'Indian',
]);

export function extractContinent(label: string, strict = false) {
  if (label.includes('Istanbul')) {
    return 'Europe';
  }

  const indexFindFunction = strict ? 'indexOf' : 'lastIndexOf';
  const separatorIndex = label[indexFindFunction]('/');
  return separatorIndex === -1 ? label : label.slice(0, separatorIndex);
}

export function isRegularContinent(continent: string) {
  return continentAllowList.has(continent);
}
