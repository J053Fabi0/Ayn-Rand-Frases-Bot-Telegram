import { ObjectId } from "../../deps.ts";
import Quote from "../../types/collections/quote.type.ts";
import isMongoId from "../../types/typeGuards/isMongoId.ts";
import { getSourceById } from "../mongo/source.controller.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import { createQuote, changeQuote, aggregateQuote } from "../mongo/quote.controller.ts";

export type PostQuote = { quote: string; sourceId: string | null; authorId: string };
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
    // lower than the lowest, to be the next one to be sent
    lastSentTime: new Date(+lowestSentTime - 1),
    author: new ObjectId(data.authorId),
    source: data.sourceId ? new ObjectId(data.sourceId) : null,
  });

  return quote;
};

export type PatchQuote = {
  quote?: string;
  archived?: false;
  authorId?: string;
  sourceId?: string | null;
} & (
  | { quoteId?: never; number: number }
  // Either quoteId or number must be provided, but not both
  | { quoteId: string; number?: never }
);
export const patchQuote = async (body: PatchQuote) => {
  const { authorId, sourceId, quote } = body;

  const patchData = {} as Partial<Quote>;

  if (quote) patchData.quote = quote;

  if (sourceId) {
    const source = await getSourceById(sourceId, { projection: { _id: 1 } });
    if (!source) return;
    patchData.source = new ObjectId(sourceId);
  } else if (sourceId === null) patchData.source = null;

  if (authorId) {
    const author = await getAuthorById(authorId, { projection: { _id: 1 } });
    if (!author) return;
    patchData.author = new ObjectId(authorId);
  }

  const results = await changeQuote(body.quoteId ? { _id: new ObjectId(body.quoteId) } : { number: body.number }, {
    $set: patchData,
  });

  return results;
};

export const archiveQuote = (idOrNumber: string | ObjectId | number) => {
  return changeQuote(isMongoId(idOrNumber) ? { _id: new ObjectId(idOrNumber) } : { number: +idOrNumber }, {
    $set: { archived: true },
  });
};
