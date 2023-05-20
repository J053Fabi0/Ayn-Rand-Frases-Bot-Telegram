import { Bot } from "../deps.ts";
import { changeQuote, getQuotes } from "../controllers/mongo/quote.controller.ts";

const randomDate = () => new Date(Date.now() * Math.random());

export default function mezclar(bot: Bot) {
  bot.command("mezclar", async (ctx) => {
    let quotes = await getQuotes({}, { projection: { number: 1, timesSent: 1 } });

    const minVecesEnviada = Math.min(...quotes.map((q) => q.timesSent));
    quotes = quotes.filter((q) => q.timesSent === minVecesEnviada);

    const ordenAnterior = quotes.map((q) => q.number).join(", ");

    for (const quote of quotes) quote.lastSentTime = randomDate();
    await Promise.all(quotes.map(({ _id, lastSentTime }) => changeQuote({ _id }, { $set: { lastSentTime } })));

    await ctx.reply(
      `Las frases que han sido enviadas ${minVecesEnviada} ve${minVecesEnviada === 1 ? "z" : "ces"}.\n\n` +
        `Orden anterior: <code>${ordenAnterior}</code>\n\n` +
        `Orden actual: <code>${quotes
          .sort(({ lastSentTime: a }, { lastSentTime: b }) => +a - +b)
          .map((q) => q.number)
          .join(", ")}</code>`,
      { parse_mode: "HTML" }
    );
  });
}
