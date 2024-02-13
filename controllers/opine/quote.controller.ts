import { ObjectId } from "../../deps.ts";
import Quote from "../../types/collections/quote.type.ts";
import isMongoId from "../../types/typeGuards/isMongoId.ts";
import { getSourceById } from "../mongo/source.controller.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import { createQuote, changeQuote, aggregateQuote } from "../mongo/quote.controller.ts";

export type PostQuote = {
  quote: string;
  sourceId: string | null;
  authorId: string;
  language?: Quote["language"];
  sourceDetails?: Quote["sourceDetails"];
};
export const postQuote = async (data: PostQuote) => {
  const lastNumber =
    (await aggregateQuote([{ $group: { _id: null, number: { $max: "$number" } } }]))[0]?.number ?? 0;

  const lowestSentTime =
    (await aggregateQuote([{ $group: { _id: null, lastSentTime: { $min: "$lastSentTime" } } }]))[0]
      ?.lastSentTime ?? 0;

  const quote = await createQuote({
    timesSent: 0,
    archived: false,
    quote: data.quote,
    number: lastNumber + 1,
    language: data.language,
    author: new ObjectId(data.authorId),
    sourceDetails: data.sourceDetails || null,
    // lower than the lowest, to be the next one to be sent
    lastSentTime: new Date(+lowestSentTime - 1),
    source: data.sourceId ? new ObjectId(data.sourceId) : null,
  });

  return quote;
};

export type PatchQuote = {
  quote?: string;
  archived?: false;
  authorId?: string;
  sourceId?: string | null;
  language?: Quote["language"];
  sourceDetails?: Quote["sourceDetails"];
} & (
  | { quoteId?: never; number: number }
  // Either quoteId or number must be provided, but not both
  | { quoteId: string; number?: never }
);
export const patchQuote = async (data: PatchQuote) => {
  const { authorId, sourceId, quote, sourceDetails, quoteId, number, language } = data;

  const patchData = { language } as Partial<Quote>;

  if (quote) patchData.quote = quote;

  if (sourceId) {
    const source = await getSourceById(sourceId, { projection: { _id: 1 } });
    if (!source) throw new Error("Source not found");
    patchData.source = new ObjectId(sourceId);
  } else if (sourceId === null) patchData.source = null;

  if (authorId) {
    const author = await getAuthorById(authorId, { projection: { _id: 1 } });
    if (!author) throw new Error("Author not found");
    patchData.author = new ObjectId(authorId);
  }

  if (sourceDetails !== undefined) patchData.sourceDetails = sourceDetails || null;

  const results = await changeQuote(quoteId ? { _id: new ObjectId(quoteId) } : { number }, {
    $set: patchData,
  });

  return results;
};

export const archiveQuote = (idOrNumber: string | ObjectId | number) =>
  changeQuote(isMongoId(idOrNumber) ? { _id: new ObjectId(idOrNumber) } : { number: +idOrNumber }, {
    $set: { archived: true },
  });
