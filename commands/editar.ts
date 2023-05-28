import { Bot } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import getQuotesButtons from "../callbacks/getQuotesButtons.ts";
import { getAuthor } from "../controllers/mongo/author.controller.ts";
import { changeQuote, getQuote } from "../controllers/mongo/quote.controller.ts";

export default function editar(bot: Bot) {
  bot.command(["edit", "editar"], async (ctx) => {
    if (!ctx.message) return;

    const [, idString, ...words] = ctx.message.text.split(" ");

    const number = parseInt(idString);
    if (isNaN(number)) return ctx.reply(`${number} no es un número.`);

    const quote = await getQuote({ number, archived: { $ne: true } }, { projection: { author: 1 } });
    if (!quote) return tellIDIsNotValid(ctx);

    const newQuote = words.join(" ");
    if (newQuote === "") return ctx.reply("Tienes que decirme una nueva frase luego del ID.");

    await changeQuote({ _id: quote._id }, { $set: { quote: newQuote } });

    const author = await getAuthor({ _id: quote.author }, { projection: { name: 1, _id: 0 } });
    const fullNewQuote = author ? `${newQuote}\n\n - ${author.name}.` : newQuote;

    ctx.reply(fullNewQuote, { reply_markup: await getQuotesButtons(number, ctx.chat.id) });
  });
}
