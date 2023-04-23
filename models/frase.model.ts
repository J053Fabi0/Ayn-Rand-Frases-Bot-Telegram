import db from "../initDatabase.ts";
import Frase from "../types/collections/frase.type.ts";

const fraseModel = db.collection<Frase>("frases");
export default fraseModel;
