import bot from "..";
import { promisify } from "util";
import { personasDB } from "../db/collections/collections";
import iteratePromisesInChunks from "./promisesYieldedInChunks";

const sleep = promisify(setTimeout);

export default function enviarMensajeMasivo(
  mensaje: string | number,
  personas = personasDB.find().map(({ userID }) => userID)
) {
  return iteratePromisesInChunks(
    personas.map(
      (userID) => () =>
        sleep(
          1000, // Luego de 1 segundo se enviará este mensaje
          bot.telegram.sendMessage(userID, mensaje + "").catch(() => {})
        )
    ),
    5 // Se enviarán 5 mensajes al mismo tiempo cada 1 segundo.
  );
}
