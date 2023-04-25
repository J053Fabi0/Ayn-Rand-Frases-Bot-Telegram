import { Bot, FilterCtx, Context } from "../deps.ts";
import timeUntilHour from "../utils/timeUntilHour.ts";
import { HORA_DE_PUBLICACIÓN } from "../constants.ts";
import { createUser, getUser } from "../controllers/user.controller.ts";

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
      if (admins.includes(ctx.message.from.id)) await subscribe(ctx, chatID);
    } else await subscribe(ctx, chatID);
  });
}

async function subscribe(ctx: FilterCtx<Context, "message">, chatID: number) {
  if (await getUser({ telegramID: chatID })) {
    ctx.reply("Ya estabas suscrito, así que no tuve que hacer nada.");
  } else {
    await createUser({ telegramID: chatID });
    ctx.reply(
      `Muy bien. A partir de ahora te enviaré frases diario. ` +
        `La siguiente llegará en ${BigInt(timeUntilHour(HORA_DE_PUBLICACIÓN)) / 1000n / 60n} minutos.`
    );
  }
}
