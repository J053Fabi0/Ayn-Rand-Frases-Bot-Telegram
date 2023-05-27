import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
// These imports can't go in deps.ts because a strange error happens.
import { useSignal, useComputed, useSignalEffect } from "@preact/signals";

const findAuthor = (authors: Author[], id: string) => authors.find((a) => a._id.toString() === id)!;

interface AuthorSourceSelectorProps {
  authors: Author[];
  sources: Source[];
  authorId?: string;
  sourceId?: string;
}

export default function AuthorSourceSelector({ authors, sources, ...defaults }: AuthorSourceSelectorProps) {
  const author = useSignal(defaults.authorId ? findAuthor(authors, defaults.authorId) : authors[0]);
  const authorId = useComputed(() => `${author.value?._id || ""}`);
  const sourceId = useSignal(defaults.sourceId ?? `${sources[0]?._id}`);

  const filteredSources = useComputed(() =>
    sources.filter((source) => source.authors.some((thisAuthorId) => `${thisAuthorId}` === authorId.value))
  );

  const sourcesOptions = useComputed(() =>
    filteredSources.value.map((source) => <option value={`${source._id}`}>{source.name}</option>)
  );

  // Set the first source as the default source when the filtedered sources change.
  useSignalEffect(() => {
    // if there's a default source, check if it can be used as the default source
    if (
      defaults.sourceId &&
      (defaults.authorId
        ? // if there's an authorId by default, just check if the current author is the default author
          `${author.value._id}` === defaults.authorId
        : // if there's no authorId by default, check if the filtered sources contain the default source
          filteredSources.value.some((source) => `${source._id}` === defaults.sourceId))
    )
      return void (sourceId.value = defaults.sourceId);

    const [firstSource] = filteredSources.value;
    sourceId.value = firstSource ? `${firstSource?._id}` : "null";
  });

  return (
    <>
      <select
        required
        name="author"
        value={authorId.value}
        class="mt-2 p-2 border border-gray-300 rounded w-full"
        onChange={(e) => void (author.value = findAuthor(authors, e.currentTarget.value))}
      >
        {authors.map((author) => (
          <option value={`${author._id}`}>{author.name}</option>
        ))}
      </select>

      <select value={sourceId.value} required name="source" class="mt-2 p-2 border border-gray-300 rounded w-full">
        {sourcesOptions.value}
        <option value={"null"}>No source</option>
      </select>
    </>
  );
}
