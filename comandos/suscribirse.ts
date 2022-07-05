import Bot from "../types/bot.type";
import PersonasDB from "../types/personasDB.type";
import timeUntilHour from "../utils/timeUntilHour";
import { HORA_DE_PUBLICACIÓN } from "../constants.example";
import { personasDB } from "../db/collections/collections";

export default function suscribirse(bot: Bot) {
  bot.command("suscribirse", (ctx) => {
    const userID = ctx.message.chat.id;
    if (personasDB.findOne({ userID })) {
      ctx.reply("Ya estabas suscrito, así que no tuve que hacer nada.");
    } else {
      personasDB.insertOne({ userID } as PersonasDB);
      ctx.reply(
        `Muy bien. A partir de ahora te enviaré frases diario. ` +
          `La siguiente llegará en ${BigInt(timeUntilHour(HORA_DE_PUBLICACIÓN)) / 1000n / 60n} minutos.`
      );
    }
  });
}
