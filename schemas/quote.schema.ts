import { a, joi, id } from "./schemaUtils.ts";
import { MESSAGE_LENGTH_LIMIT } from "../constants.ts";

const quote = joi.string().max(MESSAGE_LENGTH_LIMIT).min(5);
const number = joi.number().integer().min(1);

export const getQuotes = a(joi.object({ authorId: id.required() }), "params");

export const postQuote = a(
  joi.object({
    authorId: id.required(),
    quote: quote.required(),
    sourceId: id.allow(null).default(null),
  })
);

export const patchQuote = a(
  joi
    .object({
      quoteId: id,
      number: number,

      quote: quote,
      authorId: id,
      sourceId: id.allow(null),
      // You can't archive a quote, for that you have to delete it
      archived: joi.allow(false),
    })
    .xor("quoteId", "number")
    .or("quote", "sourceId", "authorId", "archive")
);

export const deleteQuote = a(joi.object({ idOrNumber: joi.alternatives().try(id, number).required() }), "params");
