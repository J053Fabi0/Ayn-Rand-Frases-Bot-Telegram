import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";
import { getFullQuote } from "../controllers/mongo/quote.controller.ts";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], async (ctx, next) => {
    if (!ctx.message) return next();

    if (/^\/frases/.test(ctx.message.text || "")) return next();

    // This is called when the user sends /ver <number>
    const number = parseInt(ctx.message.text!.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(number + " no es un número.");

    const chatID = ctx.chat.id;

    const { fullQuote } = await getFullQuote({ number });

    if (fullQuote === null) return tellIDIsNotValid(ctx);

    ctx.reply(fullQuote, { reply_markup: await getQuotesButtons(number, chatID) });
  });
}
