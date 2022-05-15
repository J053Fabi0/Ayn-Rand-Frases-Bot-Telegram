import frase from "./frase";
import Bot from "../types/bot.type";
import borrar from "./borrar";

export default function acciones(bot: Bot) {
  frase(bot);
  borrar(bot);

  bot.action(/.*/, (ctx) => ctx.answerCbQuery().catch((e) => console.error(e)));
}
