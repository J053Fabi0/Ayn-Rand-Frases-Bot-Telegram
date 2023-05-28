import { Context, FilterCtx } from "../deps.ts";
import { getAllQuotesNumbers } from "../controllers/mongo/quote.controller.ts";

export default async function tellIDIsNotValid(ctx: FilterCtx<Context, "message">) {
  return ctx.reply(
    "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
      (await getAllQuotesNumbers()).join(", ") +
      "</code>",
    { parse_mode: "HTML" }
  );
}
