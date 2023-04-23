import { Bot } from "../deps.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function siguiente(bot: Bot) {
  bot.command(["siguiente", "next"], (ctx) => {
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

    // Hacer que tenga la menor cantidad de veces enviada como los demás.
    frase.vecesEnviada = Math.min(...frasesDB.find().map((a) => a.vecesEnviada));
    // Hacer que tenga 1 menos que el valor más bajo de últimaVezEnviada
    frase.últimaVezEnviada = Math.min(...frasesDB.find().map((a) => a.últimaVezEnviada)) - 1;

    ctx.reply(`Listo. Corre /frases para verla.`);
  });
}
