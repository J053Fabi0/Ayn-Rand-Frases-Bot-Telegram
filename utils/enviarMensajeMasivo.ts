import bot from "../initBot.ts";
import { sleep } from "../deps.ts";
import { personasDB } from "../db/collections/collections.ts";
import iteratePromisesInChunks from "./promisesYieldedInChunks.ts";

export default function enviarMensajeMasivo(
  mensaje: string | number,
  personas = personasDB.find().map(({ userID }) => userID)
) {
  return iteratePromisesInChunks(
    personas.map((userID) => async () => {
      await sleep(1);
      bot.api.sendMessage(userID, `${mensaje}`).catch(() => {});
    }),
    5 // Se enviarán 5 mensajes al mismo tiempo cada 1 segundo.
  );
}
