import { a, joi, id } from "./schemaUtils.ts";

export const getQuotes = a(joi.object({ authorId: id.required() }), "params");
