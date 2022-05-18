import { Markup } from "telegraf";
import { frasesDB } from "../db/collections/collections";

export default function getBotonesFrases(idActual: number, ctx: any, anterior?: number, siguiente?: number) {
  const frases = frasesDB
    .chain()
    .find()
    .data()
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);
  const indexActual = frases.findIndex(({ $loki }) => $loki === idActual);

  const customDirections = anterior || siguiente;
  if (!anterior) anterior = frases[indexActual > 0 ? indexActual - 1 : frases.length - 1].$loki;
  if (!siguiente) siguiente = frases[indexActual < frases.length - 1 ? indexActual + 1 : 0].$loki;

  const adminButtons = [];
  if (ctx.chat.id + "" === process.env.ADMIN_ID && indexActual !== -1)
    adminButtons.push(
      { text: "🗑", callback_data: `borrar_${idActual}_${anterior}_${siguiente}` },
      { text: idActual + "", callback_data: "void" }
    );

  return Markup.inlineKeyboard(
    (indexActual !== -1 || customDirections) && frases.length >= 2
      ? [
          [
            { text: "◀️", callback_data: "a_frase_" + anterior },
            ...adminButtons,
            { text: "▶️", callback_data: "s_frase_" + siguiente },
          ],
        ]
      : [adminButtons]
  );
}
