import * as a from "./dbUtils.ts";
import Model from "../models/quote.model.ts";

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

export const getNextQuotesNumbers = async () => {
  const maxTimeSent =
    (await aggregateQuote([{ $group: { _id: null, timesSent: { $max: "$timesSent" } } }]))[0]?.timesSent ?? 0;

  return (await getQuotes({ timesSent: maxTimeSent }, { projection: { number: 1, lastSentTime: 1 } }))
    .sort((a, b) => +a.lastSentTime - +b.lastSentTime)
    .map(({ number }) => number);
};
