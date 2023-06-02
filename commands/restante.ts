import { Bot } from "../deps.ts";
import { publishQuoteCron } from "../utils/crons.ts";
import { PUBLICATION_HOUR, TIMEZONE } from "../env.ts";
import msToTimeDescription from "../utils/msToTimeDescription.ts";

export default function restante(bot: Bot) {
  bot.command("restante", (ctx) => {
    if (ctx.chat.type === "private")
      ctx.reply(
        `${msToTimeDescription(publishQuoteCron.msToNext() || 0)}\n\n` +
          `A las ${PUBLICATION_HOUR} horas, tiempo de ${TIMEZONE}.`
      );
  });
}
