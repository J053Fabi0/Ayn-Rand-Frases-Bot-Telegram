import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { getQuote, changeQuote } from "../controllers/mongo/quote.controller.ts";

export default function saltar(bot: Bot) {
  bot.command(["saltar", "skip"], async (ctx) => {
    if (!ctx.message) return;

    const number = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const quote = await getQuote({ number, archived: { $ne: true } }, { projection: { timesSent: 1 } });
    if (!quote) return tellIDIsNotValid(ctx);

    await changeQuote({ number }, { $set: { lastSentTime: new Date() } });

    ctx.reply("Listo. /frases.");
  });
}
