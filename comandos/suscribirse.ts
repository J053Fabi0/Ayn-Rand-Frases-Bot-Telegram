import Bot from "../types/bot.type";
import PersonasDB from "../types/personasDB.type";
import timeUntilHour from "../utils/timeUntilHour";
import { personasDB } from "../db/collections/collections";
import { HORA_DE_PUBLICACIÓN } from "../constants";

export default function suscribirse(bot: Bot) {
  bot.command(["suscribirse", "suscribir", "suscribirme"], async (ctx) => {
    const chatID = ctx.chat.id;

    const admins =
      ctx.chat.type === "private"
        ? undefined
        : (await bot.telegram.getChatAdministrators(chatID)).map(({ user: { id } }) => id);

    // Si estamos en un grupo
    if (admins) {
      // Y es administrador
      if (admins.includes(ctx.message.from.id)) suscribir(chatID);
    } else suscribir(chatID);

    function suscribir(chatID: number) {
      if (personasDB.findOne({ userID: chatID })) {
        ctx.reply("Ya estabas suscrito, así que no tuve que hacer nada.");
      } else {
        personasDB.insertOne({ userID: chatID } as PersonasDB);
        ctx.reply(
          `Muy bien. A partir de ahora te enviaré frases diario. ` +
            `La siguiente llegará en ${BigInt(timeUntilHour(HORA_DE_PUBLICACIÓN)) / 1000n / 60n} minutos.`
        );
      }
    }
  });
}
