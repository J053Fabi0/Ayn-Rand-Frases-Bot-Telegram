import * as a from "./dbUtils.ts";
import Model from "../../models/quote.model.ts";
import { Filter, escapeHtml } from "../../deps.ts";
import Quote from "../../types/collections/quote.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { MASTODON_HASHTAGS, WEBSITE_URL } from "../../env.ts";

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
  (await getQuotes({ archived: { $ne: true } }, { projection: { number: 1 } })).map(({ number }) => number);

export interface FullQuote extends Omit<Quote, "author" | "source"> {
  author: Author | null;
  source?: Source;
}

export async function getFullQuotes(filter?: Filter<Quote>, options?: a.AggregateOptionsExtended) {
  const sort = options?.sort;
  if (sort) delete options?.sort;

  const limit = options?.limit;
  if (typeof limit === "number") delete options?.limit;

  const skip = options?.skip;
  if (typeof skip === "number") delete options?.skip;

  return (await aggregateQuote(
    [
      { $match: { archived: { $ne: true } } },
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
  filter: Filter<Quote>,
  options: Omit<a.AggregateOptionsExtended, "skip" | "limit"> = {}
) {
  const fullQuotes = await getFullQuotes(filter, { limit: 1, ...options });
  if (fullQuotes.length === 0) return null;
  return fullQuotes[0];
}

interface FinalFullQuote {
  fullQuote: string;
  quote: string;
  extras: string;
}

export function parseFullQuote(quote: FullQuote, html: true): string;
export function parseFullQuote(quote: FullQuote, html: false): FinalFullQuote;
export function parseFullQuote(quote: FullQuote, html: boolean): FinalFullQuote | string;
export function parseFullQuote(quote: FullQuote, html: boolean): FinalFullQuote | string {
  if (html) {
    const parsedQuote = escapeHtml(quote.quote);
    const author = quote.author?.name;
    const quoteWithAutor = author
      ? `${parsedQuote}\n\n - <a href="${WEBSITE_URL}/quote/${quote.number}">${escapeHtml(author)}</a>.`
      : parsedQuote;

    let source = escapeHtml(quote.source?.name || "");
    if (source && quote.source?.url) source = `<a href="${quote.source.url}">${source}</a>`;
    if (source && quote.sourceDetails) source += escapeHtml(quote.sourceDetails);

    return source ? `${quoteWithAutor} ${source}.` : quoteWithAutor;
  } else {
    let extras = `\n\n - ${quote.author?.name || "Unknown"}.`;

    let source = quote.source?.name || "";
    if (source && quote.sourceDetails) source += quote.sourceDetails;
    if (source) extras += ` ${source}.`;

    extras += `\n\n${MASTODON_HASHTAGS}`;

    return { fullQuote: `${quote.quote}${extras}`, quote: quote.quote, extras };
  }
}

export async function getParsedFullQuote(
  filter: Parameters<typeof getFullQuote>[0],
  options: Parameters<typeof getFullQuote>[1],
  html: true
): Promise<string | null>;
export async function getParsedFullQuote(
  filter: Parameters<typeof getFullQuote>[0],
  options: Parameters<typeof getFullQuote>[1],
  html: false
): Promise<FinalFullQuote | null>;
export async function getParsedFullQuote(
  filter: Parameters<typeof getFullQuote>[0],
  options: Parameters<typeof getFullQuote>[1],
  html: boolean
): Promise<FinalFullQuote | string | null> {
  const fullQuote = await getFullQuote(filter, options);
  return fullQuote ? parseFullQuote(fullQuote, html) : null;
}

/**
 * @returns A record of the authors (keys) and the number of quotes without source they have (value).
 */
export const getQuotesWithoutSource = async () =>
  (
    await aggregateQuote([
      { $match: { source: null, archived: { $ne: true } } },
      { $group: { _id: "$author", number: { $sum: 1 } } },
    ])
  ).reduce((acc, { _id, number }) => ({ ...acc, [`${_id}`]: number }), {} as QuotesWithoutSource);
export type QuotesWithoutSource = Record<string, number>;
