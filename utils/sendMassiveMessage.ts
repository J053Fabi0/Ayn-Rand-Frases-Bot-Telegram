import bot from "../initBot.ts";
import { sleep } from "../deps.ts";
import iteratePromisesInChunks from "./promisesYieldedInChunks.ts";
import { getUsers } from "../controllers/mongo/user.controller.ts";

export default async function sendMassiveMessage(
  mensaje: string | number,
  receivers: number[] = [],
  options?: Parameters<typeof bot.api.sendMessage>[2]
) {
  if (receivers.length === 0) {
    const users = await getUsers({}, { projection: { telegramID: 1 } });
    receivers.splice(0, Infinity, ...users.map(({ telegramID }) => telegramID));
  }

  return iteratePromisesInChunks(
    receivers.map((userID) => async () => {
      await sleep(1);
      bot.api.sendMessage(userID, `${mensaje}`, options).catch(() => {});
    }),
    5 // Se enviarán 5 mensajes al mismo tiempo cada 1 segundo.
  );
}
