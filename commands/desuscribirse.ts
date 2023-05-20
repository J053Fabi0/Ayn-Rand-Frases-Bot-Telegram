import { deleteUser, getUser } from "../controllers/mongo/user.controller.ts";
import { Bot, FilterCtx, Context, ObjectId } from "../deps.ts";

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

async function desuscribir(ctx: FilterCtx<Context, "message">, chatID: number) {
  const user = (await getUser({ telegramID: chatID }, { projection: { _id: 1 } })) as { _id: ObjectId } | null;
  if (user) {
    await deleteUser({ _id: user._id });
    ctx.reply("Listo, no recibirás más frases.");
  } else {
    ctx.reply("No estabas suscrito.");
  }
}
