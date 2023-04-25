import { Bot } from "../deps.ts";
import { ADMIN_ID } from "../env.ts";
import publishQuote from "../publishQuote.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { getQuote } from "../controllers/quote.controller.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], async (ctx, next) => {
    if (!ctx.message) return next();

    if (/^\/frases/.test(ctx.message.text || "")) return next();

    const chatID = ctx.chat.id + "";
    if (ctx.message.text === "/frase" || chatID !== ADMIN_ID)
      return publishQuote({ chatID, chatType: ctx.chat.type });

    const number = parseInt(ctx.message.text!.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(number + " no es un número.");

    const quote = (await getQuote({ number }, { projection: { quote: 1, number: 1 } })) as {
      quote: string;
      number: number;
    } | null;

    if (!quote) return tellIDIsNotValid(ctx);

    ctx.reply(quote.quote, { reply_markup: await getQuotesButtons(quote.number, ctx.chat.id) });
  });
}
