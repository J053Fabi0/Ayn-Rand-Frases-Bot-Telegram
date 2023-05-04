import { a, joi, id } from "./schemaUtils.ts";
import { MESSAGE_LENGTH_LIMIT } from "../constants.ts";

const quote = joi.string().max(MESSAGE_LENGTH_LIMIT).min(5);

export const getQuotes = a(joi.object({ authorId: id.required() }), "params");

export const postQuote = a(
  joi.object({
    authorId: id.required(),
    quote: quote.required(),
    sourceId: id.allow("").default(null),
  })
);
