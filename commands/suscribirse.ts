import { Bot, FilterCtx, Context } from "../deps.ts";
import { publishQuoteCron } from "../utils/crons.ts";
import { PUBLICATION_HOUR, TIMEZONE } from "../constants.ts";
import msToTimeDescription from "../utils/msToTimeDescription.ts";
import { createUser, getUser } from "../controllers/mongo/user.controller.ts";

export default function suscribirse(bot: Bot) {
  bot.command(["suscribirse", "suscribir", "suscribirme", "subscribe"], async (ctx) => {
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
      `Muy bien. A partir de ahora te enviaré frases diario.\n\n` +
        `La siguiente llegará en ${msToTimeDescription(publishQuoteCron.msToNext() || 0)}, ` +
        `a las ${PUBLICATION_HOUR} horas, tiempo de ${TIMEZONE}.`
    );
  }
}
