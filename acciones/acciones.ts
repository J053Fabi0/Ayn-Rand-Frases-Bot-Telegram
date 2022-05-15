import Bot from "../types/bot.type";
import frase from "./frase";

export default function acciones(bot: Bot) {
  frase(bot);

  bot.action(/.*/, (ctx) => ctx.answerCbQuery());
}
