import frase from "./frase";
import borrar from "./borrar";
import Bot from "../types/bot.type";

export default function acciones(bot: Bot) {
  frase(bot);
  borrar(bot);

  bot.action(/.*/, (ctx) => ctx.answerCbQuery().catch((e) => console.error(e)));
}
