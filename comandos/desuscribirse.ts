import Bot from "../types/bot.type";
import { personasDB } from "../db/collections/collections";

export default function desuscribirse(bot: Bot) {
  bot.command(["desuscribirse", "desuscribir", "desuscribirme"], async (ctx) => {
    const chatID = ctx.chat.id;

    const admins =
      ctx.chat.type === "private"
        ? undefined
        : (await bot.telegram.getChatAdministrators(chatID)).map(({ user: { id } }) => id);

    // Si estamos en un grupo
    if (admins) {
      // Y es administrador
      if (admins.includes(ctx.message.from.id)) desuscribir(chatID);
    } else desuscribir(chatID);

    function desuscribir(chatID: number) {
      if (personasDB.findOne({ userID: chatID })) {
        personasDB.findAndRemove({ userID: chatID });
        ctx.reply("Listo, no recibirás más frases.");
      } else {
        ctx.reply("No estabas suscrito.");
      }
    }
  });
}
