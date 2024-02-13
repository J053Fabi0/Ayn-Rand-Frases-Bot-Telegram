import Button from "../components/Button.tsx";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal, useComputed } from "@preact/signals";
import AuthorSourceSelector from "./AuthorSourceSelector.tsx";
import { NewQuoteProps } from "../routes/quote/newOrEdit.tsx";
import Quote, { EssentialQuote } from "../components/Quote.tsx";
import { language, languages } from "../types/languages.type.ts";

export default function NewOrEditQuote({ authors, quote, sources }: NewQuoteProps) {
  const editing = quote !== null;

  const quoteString = useSignal("");
  const sourceString = useSignal("");
  const authorString = useSignal("");
  const sourceDetailsString = useSignal("");
  const sourceUrlString = useSignal<string | null>(null);
  const languageString = useSignal<language | undefined>(quote ? quote.language : languages[0]);

  const computedQuote = useComputed<EssentialQuote>(
    () =>
      ({
        quote: quoteString.value,
        language: languageString.value,
        author: { name: authorString.value },
        sourceDetails: sourceDetailsString.value,
        source: { name: sourceString.value, url: sourceUrlString.value },
      } satisfies EssentialQuote)
  );

  if (!quoteString.value && !sourceString.value && !authorString.value && !sourceDetailsString.value && quote) {
    quoteString.value = quote.quote;
    sourceDetailsString.value = quote.sourceDetails ?? "";
    if (quote.source?.name) sourceString.value = quote.source.name;
    if (quote.source?.url) sourceUrlString.value = quote.source.url;
    if (quote.author?.name) authorString.value = quote.author.name;
  }
  if (!authorString.value && authors.length) authorString.value = authors[0].name;
  if (!sourceString.value && sources.length) {
    sourceString.value = sources[0].name;
    sourceUrlString.value = sources[0].url || null;
  }

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
            onSourceChange={(newSourceId) => {
              const source = sources.find((s) => `${s._id}` === newSourceId)!;
              sourceString.value = source.name || "";
              sourceUrlString.value = source.url || null;
            }}
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

        {languages.map((lang) => (
          <label key={lang} class="mt-2 ml-2 select-none">
            <input
              required
              defaultChecked={IS_BROWSER ? languageString.value === lang : undefined}
              onChange={(e) => {
                if (e.currentTarget.checked) languageString.value = lang;
              }}
              type="radio"
              name="language"
              value={lang}
              class="mr-1"
            />
            <span>{lang.toUpperCase()}</span>
          </label>
        ))}

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 py-2 px-4 text-lg" type="submit" color="green">
            {editing ? "Save" : "Publish"}
          </Button>
        </div>
      </form>

      {computedQuote.value.quote && <hr class="my-5" />}
      <Quote quote={computedQuote.value} />
    </>
  );
}
