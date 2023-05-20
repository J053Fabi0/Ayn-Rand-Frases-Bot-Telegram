import { Bot, ObjectId } from "../deps.ts";
import tellIDIsNotValid from "../utils/tellIDIsNotValid.ts";
import { deleteQuote, getQuote } from "../controllers/mongo/quote.controller.ts";

export default function (bot: Bot) {
  bot.command(["borrar", "eliminar", "quitar"], async (ctx) => {
    if (!ctx.message) return;

    const number = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(number)) return ctx.reply(number + " no es un número.");

    const quote = (await getQuote({ number }, { projection: { _id: 1 } })) as { _id: ObjectId } | null;

    if (!quote) return tellIDIsNotValid(ctx);

    await deleteQuote({ number });
    await ctx.reply("Listo, la he borrado.");
  });
}
