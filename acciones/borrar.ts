import { Bot } from "../deps.ts";
import getBotonesFrases from "./getBotonesFrases.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function borrar(bot: Bot) {
  bot.callbackQuery(/^borrar_/, (ctx) => {
    const [id, anterior, siguiente] = ctx.update.callback_query
      .data!.split("_")
      .slice(1)
      .map((v) => parseInt(v));

    frasesDB.remove(id);
    if (ctx.chat)
      ctx
        .reply("Listo, la he borrado.", { reply_markup: getBotonesFrases(id, ctx.chat.id, anterior, siguiente) })
        .catch((e) => console.error(e));
  });
}
