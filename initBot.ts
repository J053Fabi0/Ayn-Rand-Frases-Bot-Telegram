import { Bot } from "./deps.ts";
import publishQuote from "./publishQuote.ts";
import commands from "./commands/commands.ts";
import { ADMIN_ID, BOT_TOKEN } from "./env.ts";
import trueLength from "./utils/trueLength.ts";
import callbacks from "./callbacks/callbacks.ts";
import { MESSAGE_LENGTH_LIMIT } from "./constants.ts";
import { getAuthor } from "./controllers/mongo/author.controller.ts";
import { aggregateQuote, createQuote } from "./controllers/mongo/quote.controller.ts";

const bot = new Bot(BOT_TOKEN);

bot.catch = console.error;

export default bot;

commands(bot, "public");

bot.on("message", async (ctx, next) => {
  const chatID = ctx.chat.id;

  // Al administrador se le dejará tener acceso a los demás comandos
  if (chatID === ADMIN_ID) return next();

  // A los usuarios normales se les enviará la frase actual ante cualquier mensaje desconocido.
  // En cualquier otro tipo de chat que no sea privado, se enviará solo ante el comando /frase.
  if (ctx.chat.type === "private" || /^\/frase/.test(ctx.message.text || ""))
    await publishQuote({ chatID, chatType: ctx.chat.type }).catch(() => {});
});

callbacks(bot);
commands(bot, "admin");

// Cuando reciba un mensaje mío, será tratado como una nueva frase para añadir.
bot.on("message", async (ctx) => {
  if (!ctx.message.text) return;

  const quote = ctx.message.text;

  const messageLength = trueLength(quote);
  if (messageLength > MESSAGE_LENGTH_LIMIT)
    return ctx.reply(`Es muy largo. Mide ${messageLength} y el límite son ${MESSAGE_LENGTH_LIMIT}.`);

  const lastNumber =
    (await aggregateQuote([{ $group: { _id: null, number: { $max: "$number" } } }]))[0]?.number ?? 0;

  const aynRand = (await getAuthor({ name: "Ayn Rand" }))!;
  const a = await createQuote({
    quote,
    timesSent: 0,
    author: aynRand._id,
    number: lastNumber + 1,
    lastSentTime: new Date(0),
  });
  ctx.reply(`Esta frase tiene el ID: ${a.number}. Usa <code>/borrar ${a.number}</code> para borrarla.`, {
    parse_mode: "HTML",
  });
});

bot.start();
