import { frasesDB } from "../db/collections/collections";
import Bot from "../types/bot.type";

export default function saltar(bot: Bot) {
  bot.command(["saltar", "skip"], (ctx) => {
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

    frase.vecesEnviada++;
    frase.últimaVezEnviada = Date.now();

    ctx.replyWithHTML(
      `Listo.\n\n<code>${frasesDB
        .find()
        .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b)
        .map(({ $loki }) => $loki)
        .join(", ")}</code>`
    );
  });
}
