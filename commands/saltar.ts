import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { changeQuote, getAllQuotesNumbers } from "../controllers/quote.controller.ts";

export default function saltar(bot: Bot) {
  bot.command(["saltar", "skip"], async (ctx) => {
    if (!ctx.message) return;

    const number = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const { modifiedCount } = await changeQuote(
      { number },
      { $inc: { timesSent: 1 }, $set: { lastSentTime: new Date() } }
    );
    if (modifiedCount === 0) return tellIDIsNotValid(ctx);

    ctx.reply(`Listo.\n\n<code>${(await getAllQuotesNumbers()).join(", ")}</code>`, { parse_mode: "HTML" });
  });
}
