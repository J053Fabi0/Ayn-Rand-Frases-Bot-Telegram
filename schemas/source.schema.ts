import { a, joi, id } from "./schemaUtils.ts";

const name = joi.string().min(5).max(50);
const authors = joi.array().items(id).min(1);

export const getSource = a(joi.object({ authorId: id.required() }), "params");

export const postSource = a(
  joi.object({
    name: name.required(),
    authors: authors.required(),
  })
);

export const patchSource = a(
  joi
    .object({
      name,
      authors,
      sourceId: id.required(),
    })
    .or("name", "authors")
);
