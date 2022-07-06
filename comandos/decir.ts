import Bot from "../types/bot.type";
import enviarMensajeMasivo from "../utils/enviarMensajeMasivo";

export default function decir(bot: Bot) {
  bot.command("decir", (ctx) => {
    const mensaje = ctx.message.text.substring(7);
    if (mensaje) enviarMensajeMasivo(mensaje);
    else ctx.reply("Tienes que decirme qué decir.");
  });
}
