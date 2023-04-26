import bot from "../initBot.ts";
import { sleep } from "../deps.ts";
import { ADMIN_ID } from "../env.ts";
import publishQuote from "../publishQuote.ts";
import timeUntilHour from "./timeUntilHour.ts";
import { HORA_DE_PUBLICACIÓN } from "../constants.ts";

export default async function startQuotes() {
  const time = timeUntilHour(HORA_DE_PUBLICACIÓN);

  console.log(
    `${BigInt(time) / 1_000n / 60n} minutos para publicar ` +
      `a las ${HORA_DE_PUBLICACIÓN} horas. - ` +
      new Date().toLocaleString()
  );
  await sleep(time / 1_000);

  let éxito = false;
  while (éxito === false)
    try {
      await publishQuote();
      éxito = true;
    } catch (e) {
      console.log(e);
      bot.api.sendMessage(ADMIN_ID, "Error al enviar frase.");
      await sleep(60 * 3);
    }

  startQuotes();
}
