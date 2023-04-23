import { sleep, Bot } from "./deps.ts";
import acciones from "./acciones/acciones.ts";
import comandos from "./comandos/comandos.ts";
import publicarFrase from "./publicarFrase.ts";
import { ADMIN_ID, BOT_TOKEN } from "./env.ts";
import trueLength from "./utils/trueLength.ts";
import FrasesDB from "./types/frasesDB.type.ts";
import timeUntilHour from "./utils/timeUntilHour.ts";
import { frasesDB } from "./db/collections/collections.ts";
import { LÍMITE_TAMAÑO_MENSAJE, HORA_DE_PUBLICACIÓN } from "./constants.ts";

const bot = new Bot(BOT_TOKEN);

export default bot;

comandos(bot, "públicos");

bot.on("message", async (ctx, next) => {
  const chatID = `${ctx.chat.id}`;

  // Al administrador se le dejará tener acceso a los demás comandos
  if (chatID === ADMIN_ID) return next();

  // A los usuarios normales se les enviará la frase actual ante cualquier mensaje desconocido.
  // En cualquier otro tipo de chat que no sea privado, se enviará solo ante el comando /frase.
  if (ctx.chat.type === "private" || /^\/frase/.test(ctx.message.text || ""))
    await publicarFrase({ chatID, chatType: ctx.chat.type }).catch(() => {});
});

acciones(bot);
comandos(bot, "administrador");

// Cuando reciba un mensaje mío, será tratado como una nueva frase para añadir.
bot.on("message", (ctx) => {
  if (!ctx.message.text) return;

  const frase = ctx.message.text;

  const messageLength = trueLength(frase);
  if (messageLength > LÍMITE_TAMAÑO_MENSAJE)
    return ctx.reply(`Es muy largo. Mide ${messageLength} y el límite son ${LÍMITE_TAMAÑO_MENSAJE}.`);

  const a = frasesDB.insertOne({ frase, últimaVezEnviada: 0, vecesEnviada: 0 } as FrasesDB);
  ctx.reply(`Esta frase tiene el ID: ${a!.$loki}. Usa <code>/borrar ${a!.$loki}</code> para borrarla.`, {
    parse_mode: "HTML",
  });
});

async function comenzarFrases() {
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
      await publicarFrase();
      éxito = true;
    } catch (e) {
      console.log(e);
      bot.api.sendMessage(ADMIN_ID, "Error al enviar frase.");
      await sleep(5);
    }

  comenzarFrases();
}
comenzarFrases();

bot.start();
