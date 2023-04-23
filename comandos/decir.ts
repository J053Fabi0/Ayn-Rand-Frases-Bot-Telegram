import { Bot } from "../deps.ts";
import enviarMensajeMasivo from "../utils/enviarMensajeMasivo.ts";

export default function decir(bot: Bot) {
  bot.command("decir", (ctx) => {
    if (!ctx.message) return;
    const mensaje = ctx.message.text.substring(7);
    if (mensaje) enviarMensajeMasivo(mensaje);
    else ctx.reply("Tienes que decirme qué decir.");
  });
}
