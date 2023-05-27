import { NewQuoteProps } from "../routes/quote/new.tsx";
import Author from "../types/collections/author.type.ts";
// These imports can't go in deps.ts because a strange error happens.
import { useSignal, useComputed, useSignalEffect } from "@preact/signals";

const findAuthor = (authors: Author[], id: string) => authors.find((a) => a._id.toString() === id)!;

export default function AuthorSourceSelector({ authors, sources }: NewQuoteProps) {
  const author = useSignal(authors[0]);
  const sourceId = useSignal(sources[0]?._id.toString());

  const filteredSources = useComputed(() =>
    sources.filter((source) =>
      source.authors.some((authorId) => authorId.toString() === author.value._id.toString())
    )
  );
  const sourcesOptions = useComputed(() =>
    filteredSources.value.map((source) => <option value={source._id.toString()}>{source.name}</option>)
  );

  // Set the first source as the default source when the filtedered sources change.
  useSignalEffect(() => {
    const [firstSource] = filteredSources.value;
    sourceId.value = firstSource ? firstSource._id.toString() : "null";
  });

  return (
    <>
      <select
        required
        name="author"
        class="mt-2 p-2 border border-gray-300 rounded w-full"
        onChange={(e) => void (author.value = findAuthor(authors, e.currentTarget.value))}
      >
        {authors.map((author) => (
          <option value={author._id.toString()}>{author.name}</option>
        ))}
      </select>

      <select value={sourceId.value} required name="source" class="mt-2 p-2 border border-gray-300 rounded w-full">
        {sourcesOptions.value}
        <option value={"null"}>No source</option>
      </select>
    </>
  );
}
