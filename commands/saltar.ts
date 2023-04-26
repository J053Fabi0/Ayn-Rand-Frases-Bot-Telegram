import { Bot } from "../deps.ts";
import {
  getQuote,
  changeQuote,
  aggregateQuote,
  getNextQuotesNumbers,
} from "../controllers/mongo/quote.controller.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";

export default function saltar(bot: Bot) {
  bot.command(["saltar", "skip"], async (ctx) => {
    if (!ctx.message) return;

    const number = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const quote = await getQuote({ number }, { projection: { timesSent: 1 } });
    if (!quote) return tellIDIsNotValid(ctx);

    const maxTimeSent =
      (await aggregateQuote([{ $group: { _id: null, timesSent: { $max: "$timesSent" } } }]))[0]?.timesSent ?? 0;
    await changeQuote(
      { number },
      { $inc: { timesSent: quote.timesSent === maxTimeSent ? 0 : 1 }, $set: { lastSentTime: new Date() } }
    );

    ctx.reply(`Listo.\n\n<code>${(await getNextQuotesNumbers()).join(", ")}</code>`, { parse_mode: "HTML" });
  });
}
