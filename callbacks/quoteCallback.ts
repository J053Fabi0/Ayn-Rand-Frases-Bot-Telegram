import { Bot } from "../deps.ts";
import getQuotesButtons from "./getQuotesButtons.ts";
import { getQuote } from "../controllers/quote.controller.ts";

export default function quoteCallback(bot: Bot) {
  // n = next, p = previous
  bot.callbackQuery([/^n_quote_/, /^p_quote_/], async (ctx) => {
    ctx.answerCallbackQuery().catch(console.error);

    const number = parseInt(ctx.update.callback_query.data.substring(8));
    const quote = await getQuote({ number: number }, { projection: { number: 1, quote: 1 } });
    if (!quote) return ctx.editMessageText("Esta frase ha sido eliminada.").catch(console.error);

    if (ctx.chat)
      ctx
        .editMessageText(quote.quote, { reply_markup: await getQuotesButtons(quote.number, ctx.chat.id) })
        .catch(console.error);
  });
}
