import help from "./help.ts";
import decir from "./decir.ts";
import frase from "./frase.ts";
import borrar from "./borrar.ts";
import frases from "./frases.ts";
import editar from "./editar.ts";
import saltar from "./saltar.ts";
import { Bot } from "../deps.ts";
import mezclar from "./mezclar.ts";
import restante from "./restante.ts";
import publicar from "./publicar.ts";
import siguiente from "./siguiente.ts";
import suscribirse from "./suscribirse.ts";
import desuscribirse from "./desuscribirse.ts";

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
