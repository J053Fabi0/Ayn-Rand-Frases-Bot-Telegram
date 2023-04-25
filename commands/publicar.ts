import { Bot } from "../deps.ts";
import publishQuote from "../publishQuote.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { getQuote } from "../controllers/quote.controller.ts";

export default function publicar(bot: Bot) {
  bot.command("publicar", async (ctx) => {
    if (!ctx.message) return;

    const idString = ctx.message.text.split(" ")[1];
    const number = parseInt(idString);
    if (isNaN(number)) return publishQuote();

    const quote = await getQuote({ number }, { projection: { _id: 1 } });
    if (!quote) return tellIDIsNotValid(ctx);

    publishQuote({ id: quote._id });
  });
}
