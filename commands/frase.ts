import { Bot } from "../deps.ts";
import publishQuote from "../publishQuote.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";
import { getParsedFullQuote } from "../controllers/mongo/quote.controller.ts";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], async (ctx, next) => {
    if (!ctx.message) return next();

    if (/^\/frases/.test(ctx.message.text || "")) return next();

    const chatID = ctx.chat.id;

    // if no number is provided, send the current quote
    if (ctx.message.text === "/frase" || ctx.message.text === "/ver")
      return publishQuote({ chatID, chatType: ctx.chat.type });

    const number = parseInt(ctx.message.text!.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(number + " no es un número.");

    const fullQuote = await getParsedFullQuote({ number }, undefined, true);

    if (fullQuote === null) return tellIDIsNotValid(ctx);

    ctx.reply(fullQuote, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: ctx.chat.type == "private" ? await getQuotesButtons(number, chatID) : undefined,
    });
  });
}
