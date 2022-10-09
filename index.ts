import { join } from "path";
import * as dotenv from "dotenv";
import { promisify } from "util";
import { Telegraf } from "telegraf";
import comandos from "./comandos/comandos";
import acciones from "./acciones/acciones";
import publicarFrase from "./publicarFrase";
import trueLength from "./utils/trueLength";
import FrasesDB from "./types/frasesDB.type";
import timeUntilHour from "./utils/timeUntilHour";
import { frasesDB } from "./db/collections/collections";
import { HORA_DE_PUBLICACIÓN, LÍMITE_TAMAÑO_MENSAJE } from "./constants";

const sleep = promisify(setTimeout);

dotenv.config();
dotenv.config({ path: join(__dirname, "..", ".env") });
if (!process.env.ADMIN_ID) console.log("ADMIN_ID no está configurado en .env"), process.exit();
if (!process.env.BOT_TOKEN) console.log("BOT_TOKEN no está configurado en .env"), process.exit();

const bot = new Telegraf(process.env.BOT_TOKEN ?? "");

comandos(bot, "públicos");

bot.on("message", async (ctx, next) => {
  const chatID = ctx.chat.id + "";

  // Al administrador se le dejará tener acceso a los demás comandos
  if (chatID === process.env.ADMIN_ID) return next();

  // A los usuarios normales se les enviará la frase actual ante cualquier mensaje desconocido.
  // En cualquier otro tipo de chat que no sea privado, se enviará solo ante el comando /frase.
  if (ctx.chat.type === "private" || /^\/frase/.test((ctx.message as any).text))
    try {
      await publicarFrase({ chatID, chatType: ctx.chat.type });
    } catch (_) {}
});

acciones(bot);
comandos(bot, "administrador");

// Cuando reciba un mensaje mío, será tratado como una nueva frase para añadir.
bot.on("message", (ctx) => {
  const frase = (ctx.message as any).text as string;

  const messageLength = trueLength(frase);
  if (messageLength > LÍMITE_TAMAÑO_MENSAJE)
    return ctx.reply(`Es muy largo. Mide ${messageLength} y el límite son ${LÍMITE_TAMAÑO_MENSAJE}.`);

  const a = frasesDB.insertOne({ frase, últimaVezEnviada: 0, vecesEnviada: 0 } as FrasesDB);
  ctx.replyWithHTML(`Esta frase tiene el ID: ${a!.$loki}. Usa <code>/borrar ${a!.$loki}</code> para borrarla.`);
});

async function comenzarFrases() {
  const time = timeUntilHour(HORA_DE_PUBLICACIÓN);

  console.log(
    `${BigInt(time) / 1_000n / 60n} minutos para publicar ` +
      `a las ${HORA_DE_PUBLICACIÓN} horas. - ` +
      new Date().toLocaleString()
  );
  await sleep(time);

  let éxito = false;
  while (éxito === false)
    try {
      await publicarFrase();
      éxito = true;
    } catch (e) {
      console.log(e);
      bot.telegram.sendMessage(+(process.env.ADMIN_ID ?? 0), "Error al enviar frase.");
      await sleep(5_000);
    }

  comenzarFrases();
}

bot
  .launch()
  .then(() => {
    console.log("Bot launched.");
    comenzarFrases();
  })
  .catch((e) => {
    console.error(e);
    process.exit();
  });

bot.catch((err) => {
  console.log(err);
  try {
    bot.telegram.sendMessage(+(process.env.ADMIN_ID ?? 0), "Error.");
  } catch (e) {
    console.log(e);
  }
});

export default bot;

//////////////////////////////////////////////////////////////
//////////////////// Save database on exit ///////////////////
//////////////////////////////////////////////////////////////
import db from "./db/initDatabase";
import customDeath from "./utils/customDeath";

customDeath(() =>
  db.saveDatabase((err: any) => {
    if (err) console.error(err);
    else console.log("DB saved.");
    process.exit(0);
  })
);
