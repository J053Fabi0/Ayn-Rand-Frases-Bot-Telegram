import { a, joi } from "./schemaUtils.ts";

export const getAuthors = a(joi.object({}), "query");
