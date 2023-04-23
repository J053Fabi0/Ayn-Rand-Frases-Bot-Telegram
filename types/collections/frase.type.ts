import CommonCollection from "./commonCollection.type.ts";

export default interface Frase extends CommonCollection {
  frase: string;
  número: number;
  vecesEnviada: number;
  últimaVezEnviada: Date;
}
