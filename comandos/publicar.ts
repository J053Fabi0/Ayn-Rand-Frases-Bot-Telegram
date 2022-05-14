import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";
import publicarFrase from "../publicarFrase";

export default function publicar(bot: Bot) {
  bot.command("publicar", (ctx) => {
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

    publicarFrase(id);
  });
}
