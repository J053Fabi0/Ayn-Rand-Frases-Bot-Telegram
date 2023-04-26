import { Bot } from "../deps.ts";
import { ADMIN_ID } from "../env.ts";
import publishQuote from "../publishQuote.ts";
import Quote from "../types/collections/quote.type.ts";
import Author from "../types/collections/author.type.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";
import { aggregateQuote } from "../controllers/mongo/quote.controller.ts";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], async (ctx, next) => {
    if (!ctx.message) return next();

    if (/^\/frases/.test(ctx.message.text || "")) return next();

    const chatID = ctx.chat.id;
    if (ctx.message.text === "/frase" || chatID !== ADMIN_ID)
      return publishQuote({ chatID, chatType: ctx.chat.type });

    // This is called when the user sends /ver <number>
    const number = parseInt(ctx.message.text!.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(number + " no es un número.");

    const possibleQuote = (await aggregateQuote([
      { $match: { number } },
      { $lookup: { from: "authors", localField: "author", foreignField: "_id", as: "author" } },
      { $project: { "_id": 0, "quote": 1, "author.name": 1 } },
    ])) as [Quote & { author: [Author] | [] }] | [] | null;

    if (!possibleQuote || possibleQuote.length === 0) return tellIDIsNotValid(ctx);

    const { quote } = possibleQuote[0];
    const author = possibleQuote[0].author[0]?.name;
    const fullQuote = author ? `${quote}\n\n - ${author}.` : quote;

    ctx.reply(fullQuote, { reply_markup: await getQuotesButtons(number, chatID) });
  });
}
