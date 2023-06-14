import { ObjectId } from "../deps.ts";
import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
// These imports can't go in deps.ts because a strange error happens.
import { useSignal, useComputed, useSignalEffect } from "@preact/signals";

const findAuthor = (authors: AuthorSourceSelectorProps["authors"], id: string) =>
  authors.find((a) => a._id === id)!;

type AddId<T> = T & { _id: string | ObjectId };

interface AuthorSourceSelectorProps {
  authorId?: string;
  sourceId?: string;
  authors: AddId<Pick<Author, "name">>[];
  sources: (AddId<Pick<Source, "name">> & { authors: (string | ObjectId)[] })[];
  onAuthorChange?: (authorId: string) => void;
  onSourceChange?: (sourceId: string) => void;
}

export default function AuthorSourceSelector({
  authors,
  sources,
  onAuthorChange,
  onSourceChange,
  ...defaults
}: AuthorSourceSelectorProps) {
  const author = useSignal(defaults.authorId ? findAuthor(authors, defaults.authorId) : authors[0]);
  const authorId = useComputed(() => (author.value?._id as string) || "");
  const sourceId = useSignal(defaults.sourceId ?? (sources[0]?._id as string));

  const filteredSources = useComputed(() =>
    sources.filter((source) => source.authors.some((thisAuthorId) => thisAuthorId === authorId.value))
  );

  const sourcesOptions = useComputed(() =>
    filteredSources.value.map((source) => <option value={source._id as string}>{source.name}</option>)
  );

  // Set the first source as the default source when the filtedered sources change.
  useSignalEffect(() => {
    // if there's a default source, check if it can be used as the default source
    if (
      defaults.sourceId &&
      (defaults.authorId
        ? // if there's an authorId by default, just check if the current author is the default author
          author.value._id === defaults.authorId
        : // if there's no authorId by default, check if the filtered sources contain the default source
          filteredSources.value.some((source) => source._id === defaults.sourceId))
    )
      return void (sourceId.value = defaults.sourceId);

    const [firstSource] = filteredSources.value;
    sourceId.value = firstSource ? (firstSource?._id as string) : "null";
  });

  return (
    <div class="flex flex-col md:flex-row gap-3 w-full">
      <select
        required
        name="author"
        value={authorId.value as string}
        class="p-2 border border-gray-300 rounded w-full"
        onChange={(e) => {
          author.value = findAuthor(authors, e.currentTarget.value);
          if (onAuthorChange) onAuthorChange(e.currentTarget.value);
        }}
      >
        {authors.map((author) => (
          <option value={`${author._id}`}>{author.name}</option>
        ))}
      </select>

      {sourcesOptions.value.length > 0 && (
        <select
          required
          name="source"
          value={sourceId.value as string}
          onChange={(e) => {
            sourceId.value = e.currentTarget.value;
            if (onSourceChange) onSourceChange(e.currentTarget.value);
          }}
          class="p-2 border border-gray-300 rounded w-full"
        >
          {sourcesOptions.value}
        </select>
      )}
    </div>
  );
}
