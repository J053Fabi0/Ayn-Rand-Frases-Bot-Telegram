import Bot from "../types/bot.type";
import groupBy from "lodash.groupby";
import { frasesDB } from "../db/collections/collections";
import FrasesDB from "../types/frasesDB.type";

export default function frases(bot: Bot) {
  bot.command(["frases", "ids"], (ctx) => {
    const frasesPorVecesEnviadas = groupBy(
      (() => {
        const frases = frasesDB.find().sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);
        if (frases.length === 0) return [{ $loki: "No hay", vecesEnviada: 0 }];
        return frases;
      })(),
      "vecesEnviada"
    );
    const keys = Object.keys(frasesPorVecesEnviadas)
      .map((a) => parseInt(a))
      .sort();

    const texto = keys
      .map(
        (key) =>
          `<b>Veces enviadas: ${key}</b>\n` +
          `<code>${frasesPorVecesEnviadas[key].map((a) => (a as FrasesDB).$loki).join(", ")}</code>`
      )
      .join("\n\n");

    ctx.replyWithHTML(texto);
  });
}
