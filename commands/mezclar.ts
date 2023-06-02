import { Bot, shuffle } from "../deps.ts";
import { changeQuote, getQuotes } from "../controllers/mongo/quote.controller.ts";

export default function mezclar(bot: Bot) {
  bot.command("mezclar", async (ctx) => {
    let quotes = await getQuotes(
      { archived: { $ne: true } },
      { projection: { number: 1, timesSent: 1, lastSentTime: 1 } }
    );

    const minTimesSent = Math.min(...quotes.map((q) => q.timesSent));
    quotes = quotes.filter((q) => q.timesSent === minTimesSent).sort((a, b) => +a.lastSentTime - +b.lastSentTime);

    const shuffledQuotes = shuffle(quotes);
    await Promise.all(
      shuffledQuotes.map((q, i) =>
        quotes[i].number !== q.number
          ? changeQuote({ _id: quotes[i]._id }, { $set: { lastSentTime: q.lastSentTime } })
          : Promise.resolve()
      )
    );

    const oldOrderString = quotes.map((q) => q.number).join(", ");
    const newOrderString = shuffledQuotes
      .map((q, i) => [
        { number: q.number, lastSentTime: q.lastSentTime },
        { number: quotes[i].number, lastSentTime: quotes[i].lastSentTime },
      ])
      .sort(([{ lastSentTime: a }], [{ lastSentTime: b }]) => +a - +b)
      .map(([, q]) => q.number)
      .join(", ");

    await ctx.reply(
      `Las frases que han sido enviadas ${minTimesSent} ve${minTimesSent === 1 ? "z" : "ces"}.\n\n` +
        `Orden anterior: <code>${oldOrderString}</code>\n\n` +
        `Orden actual: <code>${newOrderString}</code>`,
      { parse_mode: "HTML" }
    );
  });
}
