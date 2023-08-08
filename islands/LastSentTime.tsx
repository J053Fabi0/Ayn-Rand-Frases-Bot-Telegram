import dayjs from "dayjs/mod.ts";
import relativeTime from "dayjs/plugin/relativeTime.ts";
dayjs.extend(relativeTime);

interface LastSentTimeProps {
  dateToParse: string | number;
}

export default function LastSentTime({ dateToParse }: LastSentTimeProps) {
  const date = new Date(dateToParse);

  // if date is more than 2 years, return null
  if (date.getFullYear() < new Date().getFullYear() - 2) return null;

  const dayjsDate = dayjs(date);

  return (
    <>
      {date.toLocaleString()}
      &nbsp; - &nbsp;
      {dayjsDate.fromNow()}.
    </>
  );
}
