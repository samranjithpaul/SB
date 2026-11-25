export function notebookDate(value = '08/12', now = new Date()) {
  const [day, month, fixedYear] = value.trim().split('/').map(Number);
  const year = fixedYear ?? Number(new Intl.DateTimeFormat('en-IN', {
    year: 'numeric', timeZone: 'Asia/Kolkata'
  }).format(now));
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (!/^\d{2}\/\d{2}(?:\/\d{4})?$/.test(value.trim()) || year < 1000 ||
      probe.getUTCDate() !== day || probe.getUTCMonth() !== month - 1) {
    throw Error('NOTEBOOK_DATE must be a valid DD/MM or DD/MM/YYYY date.');
  }
  return value.trim().slice(0, 5) + '/' + year;
}
