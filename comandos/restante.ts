import Bot from "../types/bot.type";
import timeUntilHour from "../utils/timeUntilHour";
import { HORA_DE_PUBLICACIÓN } from "../constants";

export default function restante(bot: Bot) {
  bot.command("restante", (ctx) => {
    if (ctx.chat.type === "private")
      ctx.reply(`${BigInt(timeUntilHour(HORA_DE_PUBLICACIÓN)) / 1000n / 60n} minutos.`);
  });
}
