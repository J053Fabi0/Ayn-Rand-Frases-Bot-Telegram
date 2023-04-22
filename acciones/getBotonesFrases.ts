import { ADMIN_ID } from "../env.ts";
import { InlineKeyboard } from "grammy/mod.ts";
import { frasesDB } from "../db/collections/collections.ts";

/**
 *
 * @param idActual El id de la frase actual
 * @param userID El userID, para saber si el usuario es admin o no y ponerle así el bote de basura
 * @param anterior El id de la frase anterior
 * @param siguiente El id de la frase siguiente
 * @returns
 */
export default function getBotonesFrases(
  idActual: number,
  userID: number | string,
  anterior?: number,
  siguiente?: number
) {
  const frases = frasesDB.find().sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);
  const indexActual = frases.findIndex(({ $loki }) => $loki === idActual);

  const customDirections = anterior || siguiente;
  if (!anterior) anterior = frases[indexActual > 0 ? indexActual - 1 : frases.length - 1].$loki;
  if (!siguiente) siguiente = frases[indexActual < frases.length - 1 ? indexActual + 1 : 0].$loki;

  const adminButtons = [];
  if (`${userID}` === ADMIN_ID && indexActual !== -1)
    adminButtons.push(
      { text: "🗑", callback_data: `borrar_${idActual}_${anterior}_${siguiente}` },
      { text: `${idActual}`, callback_data: "void" }
    );

  return new InlineKeyboard(
    (indexActual !== -1 || customDirections) && frases.length >= 2
      ? [
          [
            { text: "◀️", callback_data: `a_frase_${anterior}` },
            ...adminButtons,
            { text: "▶️", callback_data: `s_frase_${siguiente}` },
          ],
        ]
      : [adminButtons]
  );
}
