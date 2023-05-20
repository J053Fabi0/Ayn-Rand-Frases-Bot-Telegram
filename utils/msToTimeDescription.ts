function addSingularPlural(value: number) {
  return value > 1 ? "s" : "";
}

export function rangeMsToTimeDescription(date1: number | Date, date2: number | Date = Date.now()) {
  return msToTimeDescription(Math.abs(+date2 - +date1));
}

export default function msToTimeDescription(ms: number | Date) {
  const totalTimes = {
    seconds: Math.floor(+ms / 1000),
    minutes: Math.floor(+ms / 60000),
    hours: Math.floor(+ms / 3600000),
    days: Math.floor(+ms / 86400000),
  };
  const leftTimes = {
    seconds: totalTimes.seconds - totalTimes.minutes * 60,
    minutes: totalTimes.minutes - totalTimes.hours * 60,
    hours: totalTimes.hours - totalTimes.days * 24,
    days: totalTimes.days,
  };

  const timeDescription = [];
  if (leftTimes.days > 0) timeDescription.push(`${leftTimes.days} día${addSingularPlural(leftTimes.days)}`);
  if (leftTimes.hours > 0) timeDescription.push(`${leftTimes.hours} hora${addSingularPlural(leftTimes.hours)}`);
  if (leftTimes.minutes > 0)
    timeDescription.push(`${leftTimes.minutes} minuto${addSingularPlural(leftTimes.minutes)}`);
  if (leftTimes.seconds > 0)
    timeDescription.push(`${leftTimes.seconds} segundo${addSingularPlural(leftTimes.seconds)}`);

  if (timeDescription.length === 0) return "0 segundos";
  else if (timeDescription.length === 1) return timeDescription[0];
  else return `${timeDescription.slice(0, -1).join(", ")} y ${timeDescription.slice(-1)}`;
}

// Tests
// const now = new Date();
// const past = new Date();
// past.setDate(past.getDate() - 365);
// past.setHours(past.getHours() - 23);
// past.setMinutes(past.getMinutes() - 59);
// console.log(rangeMsToTimeDescription(past, now));
