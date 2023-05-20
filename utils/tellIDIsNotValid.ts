import { getAllQuotesNumbers } from "../controllers/mongo/quote.controller.ts";
import { Context, FilterCtx } from "../deps.ts";

export default async function tellIDIsNotValid(ctx: FilterCtx<Context, "message">) {
  return ctx.reply(
    "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
      (await getAllQuotesNumbers()).sort().join(", ") +
      "</code>",
    { parse_mode: "HTML" }
  );
}
