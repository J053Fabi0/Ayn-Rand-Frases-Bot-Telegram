/**
 * Dada una hora del día, se calcula cuánto tiempo falta para llegar a ella. Se suma un día si la hora este día ya pasó.
 * @param hour La hora del día actual o siguiente a la que se quiere llegar.
 * @returns Los milisegundos que faltan para llegar a esa hora.
 */
export default function timeUntilHour(hour: number) {
  const today = new Date();
  const morgen = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour);
  if (+morgen < +today) morgen.setDate(morgen.getDate() + 1);
  return +morgen - +today;
}
