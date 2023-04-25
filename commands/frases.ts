import { Bot, _ } from "../deps.ts";
import Quote from "../types/collections/quote.type.ts";
import { getQuotes } from "../controllers/quote.controller.ts";

export default function frases(bot: Bot) {
  bot.command(["frases", "ids"], async (ctx) => {
    const quotesByTimesSent = _.groupBy(
      await (async () => {
        const quotes = await getQuotes({}, { projection: { _id: 0, number: 1, timesSent: 1, lastSentTime: 1 } });
        if (quotes.length === 0) return [{ number: "No hay", timesSent: 0 }] as unknown as Quote[];
        return quotes;
      })(),
      "timesSent"
    );

    const keys = Object.keys(quotesByTimesSent)
      .map((a) => parseInt(a))
      .sort();

    const message = keys
      .map(
        (key) =>
          `<b>Veces enviadas: ${key}</b>\n` +
          `<code>${quotesByTimesSent[key]
            .sort((a, b) => +a.lastSentTime - +b.lastSentTime)
            .map((a) => a.number)
            .join(", ")}</code>`
      )
      .join("\n\n");

    ctx.reply(message, { parse_mode: "HTML" });
  });
}
