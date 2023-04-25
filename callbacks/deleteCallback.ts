import { Bot } from "../deps.ts";
import getQuotesButton from "./getQuotesButtons.ts";
import { deleteQuote } from "../controllers/quote.controller.ts";

export default function deleteCallback(bot: Bot) {
  bot.callbackQuery(/^delete_/, async (ctx) => {
    const [number, previous, next] = ctx.update.callback_query
      .data!.split("_")
      .slice(1)
      .map((v) => parseInt(v));

    await deleteQuote({ number });

    if (ctx.chat)
      ctx
        .reply("Listo, la he borrado.", {
          reply_markup: await getQuotesButton(number, ctx.chat.id, previous, next),
        })
        .catch(console.error);
  });
}
