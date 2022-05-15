import { Markup } from "telegraf";
import { frasesDB } from "../db/collections/collections";

export default function getBotonesFrases(idActual: number) {
  const frases = frasesDB
    .chain()
    .find()
    .data()
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);
  const indexActual = frases.findIndex(({ $loki }) => $loki === idActual);

  return Markup.inlineKeyboard(
    indexActual !== -1 && frases.length >= 2
      ? [
          [
            {
              text: "◀️",
              callback_data: "a_frase_" + frases[indexActual > 0 ? indexActual - 1 : frases.length - 1].$loki,
            },
            {
              text: "▶️",
              callback_data: "s_frase_" + frases[indexActual < frases.length - 1 ? indexActual + 1 : 0].$loki,
            },
          ],
        ]
      : [[]]
  );
}
