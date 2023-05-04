import { a, joi } from "./schemaUtils.ts";

const name = joi.string().min(3).max(30);

export const getAuthors = a(joi.object({}), "query");

export const postAuthor = a(joi.object({ name: name.required() }));
