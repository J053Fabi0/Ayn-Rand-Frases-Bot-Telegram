import { Bot } from "../deps.ts";
import sendMassiveMessage from "../utils/sendMassiveMessage.ts";

export default function decir(bot: Bot) {
  bot.command("decir", (ctx) => {
    if (!ctx.message) return;
    const message = ctx.message.text.substring(7);
    if (message) sendMassiveMessage(message);
    else ctx.reply("Tienes que decirme qué decir. Puedes usar /decir <mensaje>");
  });
}
