import { Joi } from "../deps.ts";
import { a, joi } from "./schemaUtils.ts";

export const auth = a(
  joi.object({
    token: Joi.string().required(),
  }),
  "query"
);
