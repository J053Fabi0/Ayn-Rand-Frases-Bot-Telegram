import dayjs from "https://deno.land/x/deno_dayjs@v0.3.0/mod.ts";
import relativeTime from "https://deno.land/x/deno_dayjs@v0.3.0/plugin/relativeTime.ts";
dayjs.extend(relativeTime);

interface LastSentTimeProps {
  dateToParse: string | number;
}

export default function LastSentTime({ dateToParse }: LastSentTimeProps) {
  const date = new Date(dateToParse);

  const dayjsDate = dayjs(date);

  return (
    <>
      {date.toLocaleString()}
      <br />
      {dayjsDate.fromNow()}
    </>
  );
}
