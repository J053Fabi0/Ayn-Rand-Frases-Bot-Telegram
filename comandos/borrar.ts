import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";

export default function (bot: Bot) {
  bot.command(["borrar", "eliminar", "quitar"], (ctx) => {
    const id = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    if (!frasesDB.findOne({ $loki: id }))
      return ctx.replyWithHTML(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>"
      );

    frasesDB.remove(id);
    ctx.reply("Listo, la he borrado.");
  });
}
