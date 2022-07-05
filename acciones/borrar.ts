import Bot from "../types/bot.type";
import getBotonesFrases from "./getBotonesFrases";
import { frasesDB } from "../db/collections/collections";
import { Chat } from "telegraf/typings/core/types/typegram";

export default function borrar(bot: Bot) {
  bot.action(/^borrar_/, (ctx) => {
    const [id, anterior, siguiente] = ctx.update.callback_query
      .data!.split("_")
      .slice(1)
      .map((v) => parseInt(v));

    frasesDB.remove(id);
    ctx
      .reply("Listo, la he borrado.", getBotonesFrases(id, (ctx.chat as Chat).id, anterior, siguiente))
      .catch((e) => console.error(e));
  });
}
