import Button from "../components/Button.tsx";
import { useSignal, useComputed } from "@preact/signals";
import AuthorSourceSelector from "./AuthorSourceSelector.tsx";
import { NewQuoteProps } from "../routes/quote/newOrEdit.tsx";
import Quote, { EssentialQuote } from "../components/Quote.tsx";

export default function NewOrEditQuote({ authors, quote, sources }: NewQuoteProps) {
  const editing = quote !== null;

  const quoteString = useSignal("");
  const sourceString = useSignal("");
  const authorString = useSignal("");
  const sourceDetailsString = useSignal("");
  const computedQuote = useComputed<EssentialQuote>(() => ({
    quote: quoteString.value,
    source: { name: sourceString.value },
    author: { name: authorString.value },
    sourceDetails: sourceDetailsString.value,
  }));

  if (!quoteString.value && !sourceString.value && !authorString.value && !sourceDetailsString.value && quote) {
    quoteString.value = quote.quote;
    sourceDetailsString.value = quote.sourceDetails ?? "";
    if (quote.source?.name) sourceString.value = quote.source.name;
    if (quote.author?.name) authorString.value = quote.author.name;
  }
  if (!authorString.value && authors.length) authorString.value = authors[0].name;
  if (!sourceString.value && sources.length) sourceString.value = sources[0].name;

  const sourcesWithNull = [...sources, { _id: "null", name: "No source", authors: authors.map((a) => a._id) }];

  return (
    <>
      <form method="post">
        <div class="flex flex-col">
          <textarea
            required
            rows={10}
            name="quote"
            placeholder="Quote*"
            value={quoteString}
            class="my-2 p-2 border border-gray-300 rounded w-full"
            onInput={(e) => (quoteString.value = e.currentTarget.value)}
          />

          <AuthorSourceSelector
            authors={authors}
            sources={sourcesWithNull}
            authorId={`${quote?.author?._id || authors[0]._id || ""}`}
            sourceId={`${quote?.source?._id || sources[0]._id || ""}`}
            onAuthorChange={(newAuthorId) =>
              (authorString.value = authors.find((a) => `${a._id}` === newAuthorId)?.name || "")
            }
            onSourceChange={(newSourceId) =>
              (sourceString.value = sources.find((s) => `${s._id}` === newSourceId)?.name || "")
            }
          />

          <input
            type="text"
            name="sourceDetails"
            value={sourceDetailsString}
            placeholder="Source details"
            class="my-2 p-2 border border-gray-300 rounded w-full"
            onInput={(e) => (sourceDetailsString.value = e.currentTarget.value)}
          />
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 py-2 px-4 text-lg" type="submit" color="green">
            {editing ? "Save" : "Publish"}
          </Button>
        </div>
      </form>

      <hr class="my-5" />
      <Quote quote={computedQuote.value} />
    </>
  );
}
