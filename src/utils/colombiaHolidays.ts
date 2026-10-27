// Festivos de Colombia (calculados, sin conexión externa).
// Incluye las reglas de la Ley Emiliani: algunos festivos se trasladan al lunes siguiente o anterior.

const pad = (n: number) => String(n).padStart(2, '0');
const toKey = (d: Date) => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;

// Fecha de Pascua (algoritmo anónimo gregoriano), en UTC.
const easterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3 = marzo, 4 = abril
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
};

// Ley Emiliani: lunes se queda; martes y miércoles pasan al lunes anterior; jueves a domingo pasan al lunes siguiente.
const moveToMonday = (d: Date): Date => {
  const dow = d.getUTCDay(); // 0 = domingo ... 6 = sábado
  let offset = 0;
  if (dow === 2) offset = -1;
  else if (dow === 3) offset = -2;
  else if (dow === 4) offset = 4;
  else if (dow === 5) offset = 3;
  else if (dow === 6) offset = 2;
  else if (dow === 0) offset = 1;
  return new Date(d.getTime() + offset * 86400000);
};

const addDays = (d: Date, days: number) => new Date(d.getTime() + days * 86400000);

const holidaysCache: Record<number, Set<string>> = {};

export const getColombiaHolidays = (year: number): Set<string> => {
  if (holidaysCache[year]) return holidaysCache[year];

  const set = new Set<string>();
  const add = (d: Date) => set.add(toKey(d));
  const utc = (m: number, day: number) => new Date(Date.UTC(year, m - 1, day));

  // Festivos fijos (no se trasladan)
  add(utc(1, 1));   // Año Nuevo
  add(utc(5, 1));   // Día del Trabajo
  add(utc(7, 20));  // Independencia
  add(utc(8, 7));   // Batalla de Boyacá
  add(utc(12, 8));  // Inmaculada Concepción
  add(utc(12, 25)); // Navidad

  // Festivos que se trasladan al lunes (Ley Emiliani)
  [utc(1, 6), utc(3, 19), utc(6, 29), utc(8, 15), utc(10, 12), utc(11, 1), utc(11, 11)]
    .forEach(d => add(moveToMonday(d)));

  // Festivos ligados a Pascua
  const easter = easterSunday(year);
  add(addDays(easter, -3)); // Jueves Santo
  add(addDays(easter, -2)); // Viernes Santo
  [39, 60, 68].forEach(offset => add(moveToMonday(addDays(easter, offset)))); // Ascensión, Corpus Christi, Sagrado Corazón

  holidaysCache[year] = set;
  return set;
};

// Recibe una fecha 'YYYY-MM-DD' (o cualquier texto de fecha ISO).
export const isColombianHoliday = (dateStr: string): boolean => {
  if (!dateStr) return false;
  const year = Number(dateStr.slice(0, 4));
  const key = dateStr.slice(0, 10);
  if (!year) return false;
  return getColombiaHolidays(year).has(key);
};
