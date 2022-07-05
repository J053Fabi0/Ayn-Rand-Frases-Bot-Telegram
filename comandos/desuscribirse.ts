import Bot from "../types/bot.type";
import { personasDB } from "../db/collections/collections";

export default function desuscribirse(bot: Bot) {
  bot.command("desuscribirse", (ctx) => {
    const userID = ctx.message.chat.id;
    if (personasDB.findOne({ userID })) {
      personasDB.findAndRemove({ userID });
      ctx.reply("Listo, no recibirás más frases.");
    } else {
      ctx.reply("No estabas suscrito.");
    }
  });
}
