import Bot from "../types/bot.type.ts";
import publicarFrase from "../publicarFrase.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function publicar(bot: Bot) {
  bot.command("publicar", (ctx) => {
    if (!ctx.message) return;

    const idString = ctx.message.text.split(" ")[1];
    const id = parseInt(idString);
    if (isNaN(id)) return publicarFrase();

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

    publicarFrase({ id });
  });
}
