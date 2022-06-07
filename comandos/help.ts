import Bot from "../types/bot.type";

const mensajeAyuda =
  "· <code>/frases</code> - Muestra los IDs de las frases existentes.\n" +
  "· <code>/decir &#60;mensaje</code> - Publica el mensaje en el grupo.\n" +
  "· <code>/editar &#60;ID> &#60;nueva frase></code> - Cambia la frase.\n" +
  "· <code>/mezclar</code> - Mezcla las frases que faltan de enviar.\n" +
  "· <code>/skip &#60;ID></code> - Salta la frase correspondiente al ID.\n" +
  "· <code>/next &#60;ID></code> - Hace siguiente la frase correspondiente al ID.\n" +
  "· <code>/frase &#60;ID></code> - Muestra la frase correspondiente al ID.\n" +
  "· <code>/borrar &#60;ID></code> - Elimina la frase correspondiente al ID.\n" +
  "· <code>/publicar &#60;ID></code> - Publica la frase correspondiente al ID.\n" +
  "· <code>/restante</code> - Dice los minutos que faltan para publicar la siguiente.\n" +
  "\nCualquier mensaje enviado será tratado como una frase y será añadido a la colección.";

export default function help(bot: Bot) {
  bot.command(["ayuda", "help", "start"], (ctx) => void ctx.replyWithHTML(mensajeAyuda));
}
