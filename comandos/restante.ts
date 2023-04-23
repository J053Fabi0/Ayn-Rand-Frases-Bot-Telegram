import { Bot } from "../deps.ts";
import timeUntilHour from "../utils/timeUntilHour.ts";
import { HORA_DE_PUBLICACIÓN } from "../constants.ts";

export default function restante(bot: Bot) {
  bot.command("restante", (ctx) => {
    if (ctx.chat.type === "private")
      ctx.reply(`${BigInt(timeUntilHour(HORA_DE_PUBLICACIÓN)) / 1000n / 60n} minutos.`);
  });
}
