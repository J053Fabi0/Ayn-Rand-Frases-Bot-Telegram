import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";

export default function frase(bot: Bot) {
  bot.command(["frase", "ver"], (ctx) => {
    const id = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    const frase = frasesDB.findOne({ $loki: id });
    if (!frase)
      return ctx.replyWithHTML(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>"
      );

    ctx.reply(frase.frase);
  });
}
