import { sleep, Bot } from "./deps.ts";
import publishQuote from "./publishQuote.ts";
import commands from "./commands/commands.ts";
import { ADMIN_ID, BOT_TOKEN } from "./env.ts";
import trueLength from "./utils/trueLength.ts";
import callbacks from "./callbacks/callbacks.ts";
import timeUntilHour from "./utils/timeUntilHour.ts";
import { LÍMITE_TAMAÑO_MENSAJE, HORA_DE_PUBLICACIÓN } from "./constants.ts";
import { aggregateQuote, createQuote } from "./controllers/quote.controller.ts";

const bot = new Bot(BOT_TOKEN);

bot.catch = console.error;

export default bot;

commands(bot, "public");

bot.on("message", async (ctx, next) => {
  const chatID = `${ctx.chat.id}`;

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
  if (messageLength > LÍMITE_TAMAÑO_MENSAJE)
    return ctx.reply(`Es muy largo. Mide ${messageLength} y el límite son ${LÍMITE_TAMAÑO_MENSAJE}.`);

  const lastNumber =
    (await aggregateQuote([{ $group: { _id: null, número: { $max: "$number" } } }]))[0]?.number ?? 0;

  const a = await createQuote({ quote, lastSentTime: new Date(0), timesSent: 0, number: lastNumber + 1 });
  ctx.reply(`Esta frase tiene el ID: ${a.number}. Usa <code>/borrar ${a.number}</code> para borrarla.`, {
    parse_mode: "HTML",
  });
});

async function startQuotes() {
  const time = timeUntilHour(HORA_DE_PUBLICACIÓN);

  console.log(
    `${BigInt(time) / 1_000n / 60n} minutos para publicar ` +
      `a las ${HORA_DE_PUBLICACIÓN} horas. - ` +
      new Date().toLocaleString()
  );
  await sleep(time / 1_000);

  let éxito = false;
  while (éxito === false)
    try {
      await publishQuote();
      éxito = true;
    } catch (e) {
      console.log(e);
      bot.api.sendMessage(ADMIN_ID, "Error al enviar frase.");
      await sleep(5);
    }

  startQuotes();
}
startQuotes();

bot.start();
