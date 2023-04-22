export default interface FrasesDB extends Partial<LokiObj> {
  frase: string;
  vecesEnviada: number;
  últimaVezEnviada: number;
}
