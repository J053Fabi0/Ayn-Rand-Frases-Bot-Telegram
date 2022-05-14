import Bot from "../types/bot.type";
import { frasesDB } from "../db/collections/collections";

export default function frases(bot: Bot) {
  bot.command(["frases", "ids"], (ctx) =>
    ctx.replyWithHTML(
      "<code>" +
        (() => {
          const frases = frasesDB.find({});
          if (frases.length === 0) return [{ $loki: "No hay" }];
          return frases;
        })()
          .map(({ $loki }) => $loki)
          .join(", ") +
        "</code>"
    )
  );
}
