import { Bot } from "../deps.ts";
import { ADMINS_IDS } from "../env.ts";

const adminHelpMessage =
  "· <code>/frases</code> - Muestra los IDs de las frases existentes.\n" +
  "· <code>/decir &#60;mensaje</code> - Publica el mensaje en el grupo.\n" +
  "· <code>/editar &#60;ID> &#60;nueva frase></code> - Cambia la frase.\n" +
  "· <code>/mezclar</code> - Mezcla las frases que faltan de enviar.\n" +
  "· <code>/skip &#60;ID></code> - Salta la frase correspondiente al ID.\n" +
  "· <code>/next &#60;ID></code> - Hace siguiente la frase correspondiente al ID.\n" +
  "· <code>/frase &#60;ID></code> - Muestra la frase correspondiente al ID.\n" +
  "· <code>/borrar &#60;ID></code> - Elimina la frase correspondiente al ID.\n" +
  "· <code>/restante</code> - Dice los minutos que faltan para recibir la siguiente frase.\n" +
  "· <code>/publicar &#60;ID?></code> - Publica la frase correspondiente al ID, o la siguiente frase en cola si no se da ID\n" +
  "· <code>/suscribirse</code> - Suscríbete a las frases diarias.\n" +
  "· <code>/desuscribirse</code> - Desuscríbete de las frases diarias.\n" +
  "\nCualquier mensaje enviado será tratado como una frase y será añadido a la colección.";

const publicHelpMessage =
  "· /suscribirse - Suscríbete a las frases diarias.\n" +
  "· /desuscribirse - Desuscríbete de las frases diarias.\n" +
  "· /restante - Dice los minutos que faltan para recibir la siguiente frase.\n" +
  "\nCualquier otro mensaje hará que se te envíe la frase que será enviada a todos próximamente, junto con un botones interactivos " +
  "para explorar otras.";

export default function help(bot: Bot) {
  bot.command(
    ["ayuda", "help", "start"],
    (ctx) =>
      void (
        ctx.message &&
        ctx.reply(ADMINS_IDS.includes(ctx.message.chat.id) ? adminHelpMessage : publicHelpMessage, {
          parse_mode: "HTML",
        })
      )
  );
}
