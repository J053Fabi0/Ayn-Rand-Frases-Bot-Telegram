import bot from ".";
import { FIRMA } from "./constants";
import FrasesDB from "./types/frasesDB.type";
import { frasesDB } from "./db/collections/collections";

export default async function publicarFrase(id?: number) {
  const frases = frasesDB
    .chain()
    .find(id ? { $loki: id, vecesEnviada: Math.min(...frasesDB.find().map((a) => a.vecesEnviada)) } : undefined)
    .data()
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b); // Se envía siguiente la que tenga menos tiempo de haber sido enviada y que tenga el número menor de vecesEnviada.

  if (frases.length >= 1) {
    const { frase, $loki } = frases[0];
    try {
      await bot.telegram.sendMessage(process.env.GROUP_ID ?? "", frase + FIRMA);
    } catch (e) {
      console.error(e);
    }
    const fraseDB = frasesDB.findOne({ $loki }) as FrasesDB;
    fraseDB.últimaVezEnviada = Date.now();
    fraseDB.vecesEnviada = fraseDB!.vecesEnviada === undefined ? 1 : fraseDB!.vecesEnviada + 1;
  }
}
