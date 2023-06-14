import Typography from "./Typography.tsx";
import Author from "../types/collections/author.type.ts";
import { FullQuote } from "../controllers/mongo/quote.controller.ts";

export default function Quote({ quote }: { quote: FullQuote }) {
  const splitQuote = quote.quote.split("\n");
  const source = quote.source?.name || "";
  const author = quote.author?.name || "Unknown";

  return (
    <>
      {/* Quote */}
      {splitQuote.map((t, i) => (
        <Typography class={i > 0 ? "mt-2" : ""}>{t}</Typography>
      ))}

      {/* Author and source */}
      <Typography variant="lead" class="mt-4 ml-2">
        - {author}.
        {source && (
          <>
            {" "}
            <i>{source}</i>.
          </>
        )}
      </Typography>
    </>
  );
}
