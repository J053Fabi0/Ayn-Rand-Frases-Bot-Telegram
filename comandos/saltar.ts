import Bot from "../types/bot.type.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function saltar(bot: Bot) {
  bot.command(["saltar", "skip"], (ctx) => {
    if (!ctx.message) return;

    const id = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    const frase = frasesDB.findOne({ $loki: id });
    if (!frase)
      return ctx.reply(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>",
        { parse_mode: "HTML" }
      );

    frase.vecesEnviada++;
    frase.últimaVezEnviada = Date.now();

    ctx.reply(
      `Listo.\n\n<code>${frasesDB
        .find()
        .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b)
        .map(({ $loki }) => $loki)
        .join(", ")}</code>`,
      { parse_mode: "HTML" }
    );
  });
}
