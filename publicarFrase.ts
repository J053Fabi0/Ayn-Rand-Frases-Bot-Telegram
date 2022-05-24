import bot from ".";
import { FIRMA } from "./constants";
import { frasesDB } from "./db/collections/collections";

export default async function publicarFrase(id?: number) {
  const frases = frasesDB
    .chain()
    .find(id ? { $loki: id } : undefined)
    .data()
    .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);

  if (frases.length >= 1) {
    const { frase, $loki } = frases[0];
    try {
      await bot.telegram.sendMessage(process.env.GROUP_ID ?? "", frase + FIRMA);
    } catch (e) {
      console.error(e);
    }
    const fraseDB = frasesDB.findOne({ $loki });
    fraseDB!.últimaVezEnviada = Date.now();
    fraseDB!.vecesEnviada = fraseDB!.vecesEnviada === undefined ? 1 : fraseDB!.vecesEnviada + 1;
  }
}
