import { Bot } from "../deps.ts";
import PersonasDB from "../types/personasDB.type.ts";
import timeUntilHour from "../utils/timeUntilHour.ts";
import { HORA_DE_PUBLICACIÓN } from "../constants.ts";
import { personasDB } from "../db/collections/collections.ts";

export default function suscribirse(bot: Bot) {
  bot.command(["suscribirse", "suscribir", "suscribirme"], async (ctx) => {
    if (!ctx.message) return;

    const chatID = ctx.chat.id;

    const admins =
      ctx.chat.type === "private"
        ? undefined
        : (await bot.api.getChatAdministrators(chatID)).map(({ user: { id } }) => id);

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
