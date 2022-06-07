import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";

export default function mezclar(bot: Bot) {
  bot.command("mezclar", async (ctx) => {
    let frases = frasesDB.find();

    const minVecesEnviada = Math.min(...frases.map(({ vecesEnviada }) => vecesEnviada));
    frases = frases.filter(({ vecesEnviada }) => vecesEnviada === minVecesEnviada);

    const ordenActual = frases.map(({ $loki }) => $loki).join(", ");

    for (const frase of frases) frase.últimaVezEnviada = Math.floor(Math.random() * -99999);

    await ctx.replyWithHTML(
      `Las frases que han sido enviadas ${minVecesEnviada} ve${minVecesEnviada === 1 ? "z" : "ces"}.\n\n` +
        `Orden anterior: <code>${ordenActual}</code>\n\n` +
        `Orden actual: <code>${frases
          .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b)
          .map(({ $loki }) => $loki)
          .join(", ")}</code>`
    );
  });
}
