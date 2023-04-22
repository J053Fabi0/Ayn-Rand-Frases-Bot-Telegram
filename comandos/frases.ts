import { lodash } from "lodash";
import Bot from "../types/bot.type.ts";
import FrasesDB from "../types/frasesDB.type.ts";
import { frasesDB } from "../db/collections/collections.ts";

export default function frases(bot: Bot) {
  bot.command(["frases", "ids"], (ctx) => {
    const frasesPorVecesEnviadas = lodash.groupBy(
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

    ctx.reply(texto, { parse_mode: "HTML" });
  });
}
