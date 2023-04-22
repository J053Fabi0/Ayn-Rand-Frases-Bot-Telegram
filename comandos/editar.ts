import Bot from "../types/bot.type.ts";
import { frasesDB } from "../db/collections/collections.ts";
import getBotonesFrases from "../acciones/getBotonesFrases.ts";

export default function editar(bot: Bot) {
  bot.command(["edit", "editar"], (ctx) => {
    if (!ctx.message) return;

    const [, idString, ...palabras] = ctx.message.text.split(" ");

    const id = parseInt(idString);
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

    const nuevaFrase = palabras.join(" ");
    if (nuevaFrase === "") return ctx.reply("Tienes que decirme una nueva frase luego del ID.");

    frase.frase = nuevaFrase;
    ctx
      .reply(frase.frase, { reply_markup: getBotonesFrases(frase.$loki, ctx.chat.id) })
      .catch((e) => console.error(e));
  });
}
