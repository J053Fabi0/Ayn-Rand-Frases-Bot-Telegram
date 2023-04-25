import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { aggregateQuote, changeQuote, getQuote } from "../controllers/quote.controller.ts";

export default function siguiente(bot: Bot) {
  bot.command(["siguiente", "next"], async (ctx) => {
    if (!ctx.message) return;

    const number = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const quote = await getQuote({ number });
    if (!quote) return tellIDIsNotValid(ctx);

    // Hacer que tenga la menor cantidad de veces enviada como los demás.
    const lowerTimesSent =
      (await aggregateQuote([{ $group: { _id: null, timesSent: { $min: "$timesSent" } } }]))[0]?.timesSent ?? 0;
    // Hacer que tenga 1 menos que el valor más bajo de últimaVezEnviada
    const lowerLastSentTime =
      (await aggregateQuote([{ $group: { _id: null, lastSentTime: { $min: "$lastSentTime" } } }]))[0]
        ?.lastSentTime ?? new Date(1);

    await changeQuote(
      { number },
      { $set: { timesSent: lowerTimesSent, lastSentTime: new Date(+lowerLastSentTime - 1) } }
    );

    ctx.reply(`Listo. Corre /frases para verla.`);
  });
}
