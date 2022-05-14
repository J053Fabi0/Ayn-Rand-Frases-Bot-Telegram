import Bot from "../types/bot.type";

const mensajeAyuda =
  "<code>/frases</code> - Muestra los IDs de las frases existentes.\n" +
  "<code>/decir &#60;mensaje</code> - Publica el mensaje en el grupo.\n" +
  "<code>/frase &#60;ID></code> - Muestra la frase correspondiente al ID.\n" +
  "<code>/borrar &#60;ID></code> - Elimina la frase correspondiente al ID.\n" +
  "<code>/publicar &#60;ID></code> - Publica la frase correspondiente al ID.\n" +
  "<code>/restante</code> - Dice los minutos que faltan para publicar la siguiente.\n" +
  "\nCualquier mensaje enviado será tratado como una frase y será añadido a la colección.";

export default function help(bot: Bot) {
  bot.command(["ayuda", "help"], (ctx) => void ctx.replyWithHTML(mensajeAyuda));
}
