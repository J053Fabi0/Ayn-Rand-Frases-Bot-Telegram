import Typography from "./Typography.tsx";
import { createElement, Fragment } from "preact";
import Source from "../types/collections/source.type.ts";
import Author from "../types/collections/author.type.ts";
import { FullQuote } from "../controllers/mongo/quote.controller.ts";

export type EssentialQuote = Pick<FullQuote, "quote" | "sourceDetails"> & {
  author?: { name: Author["name"] } | null;
  source?: { name: Source["name"]; url?: Source["url"] } | null;
};

export default function Quote({ quote }: { quote: EssentialQuote }) {
  if (!quote.quote) return null;

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
          <span class="text-lg">
            {" "}
            {createElement(
              quote.source?.url ? "a" : (Fragment as unknown as string),
              {
                target: "_blank",
                href: quote.source?.url || "",
                class: quote.source?.url ? "ml-1 underline" : "",
              },
              <i>{source}</i>
            )}
            {quote.sourceDetails && <i>{quote.sourceDetails}</i>}.
          </span>
        )}
      </Typography>
    </>
  );
}
