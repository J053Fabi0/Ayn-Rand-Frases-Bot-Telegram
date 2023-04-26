import { Bot } from "../deps.ts";
import getQuotesButtons from "./getQuotesButtons.ts";
import Quote from "../types/collections/quote.type.ts";
import Author from "../types/collections/author.type.ts";
import { aggregateQuote } from "../controllers/mongo/quote.controller.ts";

export default function quoteCallback(bot: Bot) {
  // n = next, p = previous
  bot.callbackQuery([/^n_quote_/, /^p_quote_/], async (ctx) => {
    ctx.answerCallbackQuery().catch(console.error);

    const number = parseInt(ctx.update.callback_query.data.substring(8));
    const possibleQuote = (await aggregateQuote([
      { $match: { number } },
      { $lookup: { from: "authors", localField: "author", foreignField: "_id", as: "author" } },
      { $project: { "_id": 0, "quote": 1, "author.name": 1 } },
    ])) as [Quote & { author: [Author] | [] }] | [] | null;

    if (!possibleQuote || possibleQuote.length === 0)
      return ctx.editMessageText("Esta frase ha sido eliminada.").catch(console.error);

    const { quote } = possibleQuote[0];
    const author = possibleQuote[0].author[0]?.name;
    const fullQuote = author ? `${quote}\n\n - ${author}.` : quote;

    if (ctx.chat)
      ctx
        .editMessageText(fullQuote, { reply_markup: await getQuotesButtons(number, ctx.chat.id) })
        .catch(console.error);
  });
}
