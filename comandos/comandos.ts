import help from "./help";
import decir from "./decir";
import frase from "./frase";
import borrar from "./borrar";
import frases from "./frases";
import editar from "./editar";
import saltar from "./saltar";
import mezclar from "./mezclar";
import restante from "./restante";
import publicar from "./publicar";
import siguiente from "./siguiente";
import Bot from "../types/bot.type";
import suscribirse from "./suscribirse";
import desuscribirse from "./desuscribirse";

export default function comandos(bot: Bot, tipo: "públicos" | "administrador") {
  if (tipo === "públicos") {
    help(bot);
    restante(bot);
    suscribirse(bot);
    desuscribirse(bot);
  } else {
    frase(bot);
    decir(bot);
    borrar(bot);
    frases(bot);
    saltar(bot);
    editar(bot);
    mezclar(bot);
    publicar(bot);
    siguiente(bot);
  }
}
