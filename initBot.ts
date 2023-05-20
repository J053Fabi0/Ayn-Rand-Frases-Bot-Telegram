import { Bot } from "./deps.ts";
import publishQuote from "./publishQuote.ts";
import commands from "./commands/commands.ts";
import { ADMINS_IDS, BOT_TOKEN } from "./env.ts";
import callbacks from "./callbacks/callbacks.ts";

const bot = new Bot(BOT_TOKEN);

bot.catch = console.error;

export default bot;

commands(bot, "public");

bot.on("message", async (ctx, next) => {
  const chatID = ctx.chat.id;

  // Al administrador se le dejará tener acceso a los demás comandos
  if (ADMINS_IDS.includes(chatID)) return next();

  // A los usuarios normales se les enviará la frase actual ante cualquier mensaje desconocido.
  // En cualquier otro tipo de chat que no sea privado, se enviará solo ante el comando /frase.
  if (ctx.chat.type === "private" || /^\/frase/.test(ctx.message.text || ""))
    await publishQuote({ chatID, chatType: ctx.chat.type }).catch(() => {});
});

callbacks(bot);
commands(bot, "admin");

bot.start();
