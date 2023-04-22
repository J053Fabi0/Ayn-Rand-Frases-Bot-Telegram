import { ADMIN_ID } from "../env.ts";
import Bot from "../types/bot.type.ts";
import publicarFrase from "../publicarFrase.ts";
import { frasesDB } from "../db/collections/collections.ts";
import getBotonesFrases from "../acciones/getBotonesFrases.ts";

export default function frase(bot: Bot) {
  bot.hears([/^\/frase/, /^\/ver/], (ctx, next) => {
    if (!ctx.message) return next();

    if (/^\/frases/.test(ctx.message.text || "")) return next();

    const chatID = ctx.chat.id + "";
    if (ctx.message.text === "/frase" || chatID !== ADMIN_ID)
      return publicarFrase({ chatID, chatType: ctx.chat.type });

    const id = parseInt(ctx.message.text!.split(" ")[1]);
    if (isNaN(id)) return ctx.reply(id + " no es un número.");

    const frase = frasesDB.findOne({ $loki: id });
    if (!frase)
      return ctx.reply(
        "Ese ID no corresponde a ninguna frase. Los ID válidos son:\n\n<code>" +
          frasesDB
            .find({})
            .map(({ $loki }) => $loki)
            .join(", ") +
          "</code>",
        { parse_mode: "HTML" }
      );

    ctx.reply(frase.frase, { reply_markup: getBotonesFrases(frase.$loki, ctx.chat.id) });
  });
}
