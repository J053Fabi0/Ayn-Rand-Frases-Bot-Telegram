import maxBy from "lodash.maxby";
import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";

export default function mezclar(bot: Bot) {
  bot.command("mezclar", async (ctx) => {
    let frases = frasesDB.find().sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);

    const minVecesEnviada = Math.min(...frases.map(({ vecesEnviada }) => vecesEnviada));
    const frasesAMezclar = frases.filter(({ vecesEnviada }) => vecesEnviada === minVecesEnviada);

    const ordenActual = frasesAMezclar.map(({ $loki }) => $loki).join(", ");

    for (const frase of frasesAMezclar) frase.últimaVezEnviada = Math.floor(Math.random() * -99999);

    await ctx.replyWithHTML(
      `Las frases que han sido enviadas ${minVecesEnviada} ve${minVecesEnviada === 1 ? "z" : "ces"}.\n\n` +
        `Orden actual: <code>${ordenActual}</code>\n\n` +
        `Nuevo orden: <code>${frasesAMezclar
          .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b)
          .map(({ $loki }) => $loki)
          .join(", ")}</code>`
    );
  });
}
