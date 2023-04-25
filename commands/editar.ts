import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";
import { changeQuote, getQuote } from "../controllers/quote.controller.ts";

export default function editar(bot: Bot) {
  bot.command(["edit", "editar"], async (ctx) => {
    if (!ctx.message) return;

    const [, idString, ...words] = ctx.message.text.split(" ");

    const number = parseInt(idString);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const quote = await getQuote({ number });
    if (!quote) return tellIDIsNotValid(ctx);

    const newQuote = words.join(" ");
    if (newQuote === "") return ctx.reply("Tienes que decirme una nueva frase luego del ID.");

    await changeQuote({ number }, { $set: { quote: newQuote } });

    ctx.reply(newQuote, { reply_markup: await getQuotesButtons(quote.number, ctx.chat.id) });
  });
}
