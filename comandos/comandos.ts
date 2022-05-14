import help from "./help";
import decir from "./decir";
import frase from "./frase";
import borrar from "./borrar";
import frases from "./frases";
import restante from "./restante";
import publicar from "./publicar";
import Bot from "../types/bot.type";

export default function comandos(bot: Bot) {
  help(bot);
  frase(bot);
  decir(bot);
  borrar(bot);
  frases(bot);
  restante(bot);
  publicar(bot);
}
