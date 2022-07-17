import Bot from "../types/bot.type";
import getBotonesFrases from "./getBotonesFrases";
import { frasesDB } from "../db/collections/collections";
import { Chat } from "telegraf/typings/core/types/typegram";

export default function (bot: Bot) {
  bot.action([/^s_frase_/, /^a_frase_/], (ctx) => {
    ctx.answerCbQuery().catch((e) => console.error(e));

    const nextID = parseInt(ctx.update.callback_query.data!.substring(8));
    const frase = frasesDB.findOne({ $loki: nextID });
    if (!frase) return ctx.editMessageText("Ésta frase ha sido eliminada.").catch((e) => console.error(e));

    ctx
      .editMessageText(frase.frase, getBotonesFrases(frase.$loki, (ctx.chat as Chat).id))
      .catch((e) => console.error(e));
  });
}
