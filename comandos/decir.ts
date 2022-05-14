import Bot from "../types/bot.type";

export default function decir(bot: Bot) {
  bot.command("decir", (ctx) => {
    const mensaje = ctx.message.text.substring(7);
    if (mensaje) bot.telegram.sendMessage(process.env.GROUP_ID ?? "", mensaje);
    else ctx.reply("Tienes que decirme qué decir.");
  });
}
