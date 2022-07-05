import db from "../initDatabase";
import FrasesDB from "../../types/frasesDB.type";
import PersonasDB from "../../types/personasDB.type";
import initFrasesCollection from "./initFrasesCollection";
import initPersonasCollection from "./initPersonasCollection";

// Declarar las colecciones.
const collections: { name: string; initializer: (db: Loki) => Collection<any> }[] = [
  { name: "frases", initializer: initFrasesCollection },
  { name: "personas", initializer: initPersonasCollection },
];

// Inicializar las colleciones si no existen.
for (const { name, initializer } of collections) if (db.getCollection(name) === null) initializer(db);

// Exportarlas manualmente, para que sean visibles en los require.
export const frasesDB = db.getCollection<FrasesDB>("frases");
export const personasDB = db.getCollection<PersonasDB>("personas");
