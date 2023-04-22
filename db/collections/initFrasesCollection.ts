import FrasesDB from "../../types/frasesDB.type.ts";

const initFrasesCollection = (db: Loki) => db.addCollection<FrasesDB>("frases", { indices: ["últimaVezEnviada"] });

export default initFrasesCollection;
