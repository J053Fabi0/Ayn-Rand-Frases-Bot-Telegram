import Bot from "../types/bot.type";
import publicarFrase from "../publicarFrase";
import { frasesDB } from "../db/collections/collections";
import getBotonesFrases from "../acciones/getBotonesFrases";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], (ctx, next) => {
    if (/^\/frases/.test(ctx.message.text)) return next();

    const chatID = ctx.chat.id + "";
    if (ctx.message.text === "/frase" || chatID !== process.env.ADMIN_ID)
      return publicarFrase({ chatID, chatType: ctx.chat.type });

    const id = parseInt(ctx.message.text.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    const frase = frasesDB.findOne({ $loki: id });
    if (!frase)
      return ctx.replyWithHTML(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>"
      );

    ctx.reply(frase.frase, getBotonesFrases(frase.$loki, ctx.chat.id));
  });
}
