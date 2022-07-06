import bot from ".";
import { promisify } from "util";
import { FIRMA } from "./constants";
import FrasesDB from "./types/frasesDB.type";
import getBotonesFrases from "./acciones/getBotonesFrases";
import { frasesDB, personasDB } from "./db/collections/collections";
import iteratePromisesInChunks from "./utils/promisesYieldedInChunks";

const sleep = promisify(setTimeout);

export default async function publicarFrase(
  id?: number,
  chatID?: number | string,
  chatType?: "group" | "supergroup" | "private"
) {
  const frases = frasesDB
    .find(id ? { $loki: id } : { vecesEnviada: Math.min(...frasesDB.find().map((a) => a.vecesEnviada)) })
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b); // Se envía siguiente la que tenga menos tiempo de haber sido enviada y que tenga el número menor de vecesEnviada.

  const { frase = "No hay frases.", $loki } = frases[0] ?? {};

  try {
    if (chatID) {
      bot.telegram.sendMessage(
        chatID,
        frase + ($loki ? FIRMA : ""),
        $loki && chatType === "private" ? getBotonesFrases($loki, chatID) : undefined
      );
      return;
    }

    await iteratePromisesInChunks(
      personasDB.find().map(
        ({ userID }) =>
          () =>
            sleep(1000, bot.telegram.sendMessage(userID, frase + ($loki ? FIRMA : ""))) // Luego de 1 segundo se enviará este mensaje
      ),
      5 // Se enviarán 5 mensajes al mismo tiempo cada 1 segundo.
    );
  } catch (e) {
    console.error(e);
  }

  if (frases.length === 0) return;

  const fraseDB = frasesDB.findOne({ $loki }) as FrasesDB;
  fraseDB.últimaVezEnviada = Date.now();
  fraseDB.vecesEnviada = fraseDB!.vecesEnviada === undefined ? 1 : fraseDB!.vecesEnviada + 1;
}
