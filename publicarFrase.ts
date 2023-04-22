import bot from "./initBot.ts";
import FrasesDB from "./types/frasesDB.type.ts";
import { frasesDB } from "./db/collections/collections.ts";
import getBotonesFrases from "./acciones/getBotonesFrases.ts";
import enviarMensajeMasivo from "./utils/enviarMensajeMasivo.ts";

interface CommonParams {
  id?: number;
}
interface ParamsChat extends CommonParams {
  chatID: number | string;
  chatType: "group" | "supergroup" | "private";
}
interface ParamsNoChat extends CommonParams {
  chatID?: undefined;
  chatType?: undefined;
}
type Params = ParamsChat | ParamsNoChat;

export default async function publicarFrase({ id, chatID, chatType }: Params = {}) {
  const frases = frasesDB
    .find(
      id
        ? { $loki: id }
        : chatID !== undefined // Si se usó el comando /frase se enviará la última frase enviada, no la que sigue.
        ? undefined
        : {
            vecesEnviada: Math.min(...frasesDB.find().map((a) => a.vecesEnviada)),
          }
    )
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => (chatID === undefined ? a - b : b - a));
  // Si se está publicando a todos se envía siguiente la que tenga menos tiempo de haber sido enviada y
  // que tenga el número menor de vecesEnviada.
  // Si es usando el comando /frase, se intenciona compartir la última que se envió, así que se invierte el órden.

  const { frase = "No hay frases.", $loki = undefined } = frases[0] ?? {};

  if (chatID)
    bot.api
      .sendMessage(
        chatID,
        frase,
        $loki && chatType === "private" ? { reply_markup: getBotonesFrases($loki, chatID) } : undefined
      )
      .catch(() => {});
  else await enviarMensajeMasivo(frase);

  if (frases.length === 0 || chatID) return;

  const fraseDB = frasesDB.findOne({ $loki }) as FrasesDB;
  fraseDB.últimaVezEnviada = Date.now();
  fraseDB.vecesEnviada = fraseDB!.vecesEnviada === undefined ? 1 : fraseDB!.vecesEnviada + 1;
}
