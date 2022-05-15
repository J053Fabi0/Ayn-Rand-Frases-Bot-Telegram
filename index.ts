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
import getBotonesFrases from "./acciones/getBotonesFrases";
import { FIRMA, HORA_DE_PUBLICACIÓN, LÍMITE_TAMAÑO_MENSAJE } from "./constants";

const sleep = promisify(setTimeout);

dotenv.config({ path: join(__dirname, "..", ".env") });
if (!process.env.ADMIN_ID) console.log("ADMIN_ID no está configurado en .env"), process.exit();
if (!process.env.GROUP_ID) console.log("GROUP_ID no está configurado en .env"), process.exit();
if (!process.env.BOT_TOKEN) console.log("BOT_TOKEN no está configurado en .env"), process.exit();

const bot = new Telegraf(process.env.BOT_TOKEN ?? "");

// Solo me hará caso a mí.
bot.on("message", (ctx, n) => {
  if (ctx.message.chat.id + "" === process.env.ADMIN_ID) return n();

  if (ctx.message.chat.type === "private") {
    const [frase] = frasesDB
      .chain()
      .find()
      .data()
      .sort(({ últimaVezEnviada: a }, { últimaVezEnviada: b }) => a - b);
    if (!frase) return ctx.reply("No hay frases.");
    ctx.reply(frase.frase + FIRMA, getBotonesFrases(frase.$loki, ctx));
  }
});

comandos(bot);
acciones(bot);

// Cuando reciba un mensaje mío, será tratado como una frase.
bot.on("message", (ctx) => {
  const frase = (ctx.message as any).text as string;

  const messageLength = trueLength(frase);
  if (messageLength > LÍMITE_TAMAÑO_MENSAJE)
    return ctx.reply(`Es muy largo. Mide ${messageLength} y el límite son ${LÍMITE_TAMAÑO_MENSAJE}.`);

  const a = frasesDB.insertOne({ frase, últimaVezEnviada: 0 } as FrasesDB);
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

  await publicarFrase();
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
