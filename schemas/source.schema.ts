import { a, joi, id } from "./schemaUtils.ts";

export const getSource = a(joi.object({ authorId: id.required() }), "params");
