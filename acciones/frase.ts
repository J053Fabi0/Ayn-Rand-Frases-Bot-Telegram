import Bot from "../types/bot.type.ts";
import getBotonesFrases from "./getBotonesFrases.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function (bot: Bot) {
  bot.callbackQuery([/^s_frase_/, /^a_frase_/], (ctx) => {
    ctx.answerCallbackQuery().catch((e) => console.error(e));

    const nextID = parseInt(ctx.update.callback_query.data!.substring(8));
    const frase = frasesDB.findOne({ $loki: nextID });
    if (!frase) return ctx.editMessageText("Ésta frase ha sido eliminada.").catch((e) => console.error(e));

    if (ctx.chat)
      ctx
        .editMessageText(frase.frase, { reply_markup: getBotonesFrases(frase.$loki, ctx.chat.id) })
        .catch((e) => console.error(e));
  });
}
