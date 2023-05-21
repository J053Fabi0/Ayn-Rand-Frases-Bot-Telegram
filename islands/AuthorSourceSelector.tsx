import { useState } from "preact/hooks";
import { NewQuoteProps } from "../routes/quote/new.tsx";
import Author from "../types/collections/author.type.ts";

const findAuthor = (authors: Author[], id: string) => authors.find((a) => a._id.toString() === id)!;

export default function AuthorSourceSelector({ authors, sources }: NewQuoteProps) {
  const [author, setAuthor] = useState(authors[0]);

  return (
    <>
      <select
        required
        name="author"
        class="mt-2 p-2 border border-gray-300 rounded w-full"
        onChange={(e) => setAuthor(findAuthor(authors, e.currentTarget.value))}
      >
        {authors.map((author) => (
          <option value={author._id.toString()}>{author.name}</option>
        ))}
      </select>

      <select required name="source" class="mt-2 p-2 border border-gray-300 rounded w-full">
        {sources
          .filter((source) => source.authors.some((authorId) => authorId.toString() === author._id.toString()))
          .map((source) => (
            <option value={source._id.toString()}>{source.name}</option>
          ))}
      </select>
    </>
  );
}
