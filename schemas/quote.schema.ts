import { a, joi, id } from "./schemaUtils.ts";
import { MESSAGE_LENGTH_LIMIT } from "../constants.ts";

const quote = joi.string().max(MESSAGE_LENGTH_LIMIT).min(5);

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
      quoteId: id.required(),

      quote: quote,
      authorId: id,
      sourceId: id.allow(null),
      // You can't archive a quote, for that you have to delete it
      archived: joi.allow(false),
    })
    .or("quote", "sourceId", "authorId", "archive")
);

export const deleteQuote = a(joi.object({ id: id.required() }), "params");
