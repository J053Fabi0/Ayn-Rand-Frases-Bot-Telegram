import * as a from "./dbUtils.ts";
import { WEBSITE_URL } from "../../env.ts";
import Model from "../../models/quote.model.ts";
import Quote from "../../types/collections/quote.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { AggregateOptions, Collection, Filter, escapeHtml } from "../../deps.ts";

export const getQuotes = a.find(Model);
export const getQuote = a.findOne(Model);
export const getQuoteById = a.findById(Model);

export const countQuotes = a.count(Model);

export const createQuote = a.insertOne(Model);
export const createQuotes = a.insertMany(Model);

export const changeQuote = a.updateOne(Model);
export const changeQuotes = a.updateMany(Model);

export const deleteQuote = a.deleteOne(Model);
export const deleteQuotes = a.deleteMany(Model);

export const aggregateQuote = a.aggregate(Model);

export const getAllQuotesNumbers = async () =>
  (await getQuotes({}, { projection: { number: 1 } })).map(({ number }) => number);

export type PossibleQuote = Omit<Quote, "author" | "source"> & { author: [Author] | []; source: [Source] | [] };

export async function getFullQuote(filter: Filter<Collection<Quote>>, options?: AggregateOptions) {
  const possibleQuote = (await aggregateQuote(
    [
      { $match: filter },
      { $lookup: { from: "authors", localField: "author", foreignField: "_id", as: "author" } },
      { $lookup: { from: "sources", localField: "source", foreignField: "_id", as: "source" } },
    ],
    options
  )) as [PossibleQuote] | [] | null;

  if (!possibleQuote || possibleQuote.length === 0)
    return { possibleQuote: null, fullQuote: null } as { possibleQuote: null; fullQuote: null };

  const quote = escapeHtml(possibleQuote[0].quote);
  const author = possibleQuote[0].author[0]?.name;
  const quoteWithAutor = author
    ? `${quote}\n\n - <a href="${WEBSITE_URL}/quote/${possibleQuote[0].number}">${escapeHtml(author)}</a>.`
    : quote;

  const source = possibleQuote[0].source[0]?.name;
  const fullQuote = source ? `${quoteWithAutor} ${escapeHtml(source)}.` : quoteWithAutor;

  return { possibleQuote: possibleQuote[0], fullQuote };
}
