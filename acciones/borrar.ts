import { frasesDB } from "../db/collections/collections";
import Bot from "../types/bot.type";
import getBotonesFrases from "./getBotonesFrases";

export default function borrar(bot: Bot) {
  bot.action(/^borrar_/, (ctx) => {
    const [id, anterior, siguiente] = ctx.update.callback_query
      .data!.split("_")
      .slice(1)
      .map((v) => parseInt(v));

    frasesDB.remove(id);
    ctx
      .editMessageText("Listo, la he borrado.", getBotonesFrases(id, ctx, anterior, siguiente))
      .catch((e) => console.error(e));
  });
}
