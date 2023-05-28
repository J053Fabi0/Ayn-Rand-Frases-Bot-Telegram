import { Bot, _ } from "../deps.ts";
import Quote from "../types/collections/quote.type.ts";
import { getQuotes } from "../controllers/mongo/quote.controller.ts";

export default function frases(bot: Bot) {
  bot.command(["frases", "ids"], async (ctx) => {
    const quotes = await getQuotes(
      { archived: { $ne: true } },
      {
        projection: { _id: 0, number: 1, timesSent: 1, lastSentTime: 1 },
        sort: { lastSentTime: 1 },
      }
    );

    const quotesByTimesSent = _.groupBy(
      quotes.length === 0
        ? [{ number: "No hay", timesSent: 0, lastSentTime: new Date() } as unknown as Quote]
        : quotes,
      "timesSent"
    );

    const keys = Object.keys(quotesByTimesSent)
      .map((a) => parseInt(a))
      .sort();

    const message =
      `<b>Siguientes frases</b>\n<code>` +
      `${quotes
        .slice(0, 10)
        .map((q) => q.number)
        .join(", ")}</code>\n...\n` +
      `<code>${quotes
        .slice(-10)
        .map((q) => q.number)
        .join(", ")}</code>\n\n` +
      keys
        .map(
          (key) =>
            `<b>Veces enviadas: ${key}</b>\n` +
            `<code>${quotesByTimesSent[key]
              .sort((a, b) => +a.lastSentTime - +b.lastSentTime)
              .map((q) => q.number)
              .join(", ")}</code>`
        )
        .join("\n\n");

    ctx.reply(message, { parse_mode: "HTML" });
  });
}
