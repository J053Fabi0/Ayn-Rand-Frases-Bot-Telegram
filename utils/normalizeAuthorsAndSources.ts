import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
import { QuotesWithoutSource } from "../controllers/mongo/quote.controller.ts";

export default function normalizeAuthorsAndSources(
  authors: Author[],
  sources: Source[],
  quotesWithoutAuthor: QuotesWithoutSource = {}
) {
  const normalizedAuthors = [{ _id: "all", name: "All authors" }, ...authors];

  const authorsWithSourcesCount = authors.reduce((acc, author) => {
    const authorId = `${author._id}`;
    acc[authorId] = sources.filter((s) => s.authors.some((a) => `${a}` === authorId)).length;
    return acc;
  }, {} as Record<string, number>);

  const authorsWithQuotesWithoutSource = Object.keys(quotesWithoutAuthor);

  const normalizedSources = [
    {
      _id: "all",
      name: "All",
      // Filter out the authors that have less than 1 source.
      authors: [...authors.map((a) => `${a._id}`).filter((a) => authorsWithSourcesCount[a] >= 1), "all"],
    },

    ...sources.map((s) => ({ ...s, authors: ["all", ...s.authors] })),
  ];

  if (authorsWithQuotesWithoutSource.length > 0)
    normalizedSources.push({
      _id: "null",
      name: "Unknown source",
      authors: ["all", ...authorsWithQuotesWithoutSource],
    });

  return { authors: normalizedAuthors, sources: normalizedSources };
}
