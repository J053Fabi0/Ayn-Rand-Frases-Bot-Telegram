import { Bot } from "../deps.ts";
import { Context, Filter } from "grammy/mod.ts";
import { personasDB } from "../db/collections/collections.ts";

export default function desuscribirse(bot: Bot) {
  bot.command(["desuscribirse", "desuscribir", "desuscribirme"], async (ctx) => {
    if (!ctx.message) return;

    const chatID = ctx.chat.id;

    const admins =
      ctx.chat.type === "private"
        ? undefined
        : (await bot.api.getChatAdministrators(chatID)).map(({ user: { id } }) => id);

    // Si estamos en un grupo
    if (admins) {
      // Y es administrador
      if (admins.includes(ctx.message.from.id)) desuscribir(ctx, chatID);
    } else desuscribir(ctx, chatID);
  });
}

function desuscribir(ctx: Filter<Context, "message">, chatID: number) {
  if (personasDB.findOne({ userID: chatID })) {
    personasDB.findAndRemove({ userID: chatID });
    ctx.reply("Listo, no recibirás más frases.");
  } else {
    ctx.reply("No estabas suscrito.");
  }
}
