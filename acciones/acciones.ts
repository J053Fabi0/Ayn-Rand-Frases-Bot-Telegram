import frase from "./frase.ts";
import borrar from "./borrar.ts";
import Bot from "../types/bot.type.ts";

export default function acciones(bot: Bot) {
  frase(bot);
  borrar(bot);

  // Answer all unknown button events
  bot.on("callback_query:data", async (ctx) => {
    console.log("Unknown button event with payload", ctx.callbackQuery.data);
    await ctx.answerCallbackQuery().catch(() => {});
  });
}
