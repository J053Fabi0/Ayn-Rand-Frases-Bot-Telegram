import bot from "../initBot.ts";
import { sleep } from "../deps.ts";
import { getUsers } from "../controllers/user.controller.ts";
import handleSendMessageError from "./handleSendMessageError.ts";
import iteratePromisesInChunks from "./promisesYieldedInChunks.ts";

export default async function sendMassiveMessage(mensaje: string | number, receivers: number[] = []) {
  if (receivers.length === 0) {
    const users = await getUsers({}, { projection: { telegramID: 1 } });
    receivers.splice(0, Infinity, ...users.map(({ telegramID }) => telegramID));
  }

  return iteratePromisesInChunks(
    receivers.map((userID) => async () => {
      await sleep(1);
      bot.api.sendMessage(userID, `${mensaje}`).catch(handleSendMessageError(userID));
    }),
    5 // Se enviarán 5 mensajes al mismo tiempo cada 1 segundo.
  );
}
