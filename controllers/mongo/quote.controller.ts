import * as a from "./dbUtils.ts";
import { WEBSITE_URL } from "../../env.ts";
import Model from "../../models/quote.model.ts";
import Quote from "../../types/collections/quote.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { Collection, Filter, escapeHtml } from "../../deps.ts";

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

export interface FullQuote extends Omit<Quote, "author" | "source"> {
  author: Author | null;
  source?: Source;
}

export async function getFullQuotes(filter?: Filter<Collection<Quote>>, options?: a.AggregateOptionsExtended) {
  const sort = options?.sort;
  if (sort) delete options?.sort;

  const limit = options?.limit;
  if (typeof limit === "number") delete options?.limit;

  const skip = options?.skip;
  if (typeof skip === "number") delete options?.skip;

  return (await aggregateQuote(
    [
      ...(sort ? [{ $sort: sort }] : []),
      ...(filter ? [{ $match: filter }] : []),
      // skip and limit before lookup.
      ...(skip ? [{ $skip: skip }] : []),
      ...(limit ? [{ $limit: limit }] : []),
      { $lookup: { from: "authors", localField: "author", foreignField: "_id", as: "author" } },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $lookup: { from: "sources", localField: "source", foreignField: "_id", as: "source" } },
      { $unwind: { path: "$source", preserveNullAndEmptyArrays: true } },
    ],
    options
  )) as FullQuote[] | [];
}

export async function getFullQuote(
  filter: Filter<Collection<Quote>>,
  options: Omit<a.AggregateOptionsExtended, "skip" | "limit"> = {}
) {
  const fullQuotes = await getFullQuotes(filter, { limit: 1, ...options });
  if (fullQuotes.length === 0) return null;
  return fullQuotes[0];
}

export function parseFullQuote(quote: FullQuote) {
  const parsedQuote = escapeHtml(quote.quote);
  const author = quote.author?.name;
  const quoteWithAutor = author
    ? `${parsedQuote}\n\n - <a href="${WEBSITE_URL}/quote/${quote.number}">${escapeHtml(author)}</a>.`
    : parsedQuote;

  const source = quote.source?.name;
  return source ? `${quoteWithAutor} ${escapeHtml(source)}.` : quoteWithAutor;
}

export async function getParsedFullQuote(
  filter: Parameters<typeof getFullQuote>[0],
  options?: Parameters<typeof getFullQuote>[1]
) {
  const fullQuote = await getFullQuote(filter, options);
  return fullQuote ? parseFullQuote(fullQuote) : null;
}
