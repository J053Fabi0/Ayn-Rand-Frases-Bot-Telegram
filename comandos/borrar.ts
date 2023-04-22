import Bot from "../types/bot.type.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function (bot: Bot) {
  bot.command(["borrar", "eliminar", "quitar"], (ctx) => {
    if (!ctx.message) return;

    const id = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    if (!frasesDB.findOne({ $loki: id }))
      return ctx.reply(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>",
        { parse_mode: "HTML" }
      );

    frasesDB.remove(id);
    ctx.reply("Listo, la he borrado.");
  });
}
