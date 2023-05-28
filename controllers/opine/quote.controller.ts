import {
  createQuote,
  changeQuote,
  aggregateQuote,
  getQuotes as getQuotesCtrl,
} from "../mongo/quote.controller.ts";
import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import Quote from "../../types/collections/quote.type.ts";
import { getSourceById } from "../mongo/source.controller.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetQuotes, PostQuote, PatchQuote, DeleteQuote } from "../../types/api/quote.type.ts";

export const getQuotes = async ({ params }: GetQuotes, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const quotes = pretifyIds(
    await getQuotesCtrl({ author: new ObjectId(params.authorId) }, { projection: { author: 0 } })
  );

  res.send({ message: quotes });
};

export const postQuote = async ({ body }: PostQuote, res?: CommonResponse) => {
  const author = await getAuthorById(body.authorId, { projection: { _id: 1 } });
  if (!author) res?.setStatus(404).send({ message: null, error: "Author not found" });

  if (body.sourceId) {
    const source = await getSourceById(body.sourceId, { projection: { _id: 1 } });
    if (!source) res?.setStatus(404).send({ message: null, error: "Source not found" });
  }

  const lastNumber =
    (await aggregateQuote([{ $group: { _id: null, number: { $max: "$number" } } }]))[0]?.number ?? 0;

  const lowestSentTime =
    (await aggregateQuote([{ $group: { _id: null, lastSentTime: { $min: "$lastSentTime" } } }]))[0]
      ?.lastSentTime ?? 0;

  const quote = await createQuote({
    timesSent: 0,
    archived: false,
    quote: body.quote,
    number: lastNumber + 1,
    // lower than the lowest, to be the next one to be sent
    lastSentTime: new Date(+lowestSentTime - 1),
    author: new ObjectId(body.authorId),
    source: body.sourceId ? new ObjectId(body.sourceId) : null,
  });

  res?.send({ message: quote._id });

  return quote;
};

export const patchQuote = async ({ body }: PatchQuote, res?: CommonResponse) => {
  const { quoteId, authorId, sourceId, quote } = body;

  const patchData = {} as Partial<Quote>;

  if (quote) patchData.quote = quote;

  if (sourceId) {
    const source = await getSourceById(sourceId, { projection: { _id: 1 } });
    if (!source) return void res?.setStatus(404).send({ message: null, error: "Source not found" });
    patchData.source = new ObjectId(sourceId);
  } else if (sourceId === null) patchData.source = null;

  if (authorId) {
    const author = await getAuthorById(authorId, { projection: { _id: 1 } });
    if (!author) return void res?.setStatus(404).send({ message: null, error: "Author not found" });
    patchData.author = new ObjectId(authorId);
  }

  const results = await changeQuote({ _id: new ObjectId(quoteId) }, { $set: patchData });

  if (results.modifiedCount === 0) res?.setStatus(404).send({ message: null, error: "Quote not found" });
  else res?.sendStatus(200);

  return results;
};

export const deleteQuote = async ({ params }: DeleteQuote, res?: CommonResponse) => {
  const results = await changeQuote({ _id: new ObjectId(params._id) }, { $set: { archived: true } });

  if (results.modifiedCount === 0) res?.setStatus(404).send({ message: null, error: "Quote not found" });
  else res?.sendStatus(200);

  return results;
};
