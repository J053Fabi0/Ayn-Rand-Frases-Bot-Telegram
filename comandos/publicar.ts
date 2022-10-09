import Bot from "../types/bot.type";
import publicarFrase from "../publicarFrase";
import { frasesDB } from "../db/collections/collections";

export default function publicar(bot: Bot) {
  bot.command("publicar", (ctx) => {
    const idString = ctx.message.text.split(" ")[1];
    const id = parseInt(idString);
    if (isNaN(id)) return publicarFrase();

    if (!frasesDB.findOne({ $loki: id }))
      return ctx.replyWithHTML(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>"
      );

    publicarFrase({ id });
  });
}
