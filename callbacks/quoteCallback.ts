import { Bot } from "../deps.ts";
import getQuotesButtons from "./getQuotesButtons.ts";
import { getParsedFullQuote } from "../controllers/mongo/quote.controller.ts";

export default function quoteCallback(bot: Bot) {
  // n = next, p = previous
  bot.callbackQuery([/^n_quote_/, /^p_quote_/], async (ctx) => {
    ctx.answerCallbackQuery().catch(console.error);

    const number = parseInt(ctx.update.callback_query.data.substring(8));
    const fullQuote = await getParsedFullQuote({ number }, undefined, true);

    if (fullQuote === null) return ctx.editMessageText("Esta frase ha sido eliminada.").catch(console.error);

    if (ctx.chat)
      ctx
        .editMessageText(fullQuote, {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          reply_markup: await getQuotesButtons(number, ctx.chat.id),
        })
        .catch(console.error);
  });
}
