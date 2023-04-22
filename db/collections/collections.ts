import db from "../initDatabase.ts";
import FrasesDB from "../../types/frasesDB.type.ts";
import PersonasDB from "../../types/personasDB.type.ts";
import initFrasesCollection from "./initFrasesCollection.ts";
import initPersonasCollection from "./initPersonasCollection.ts";

// Declarar las colecciones.
const collections = [
  { name: "frases", initializer: initFrasesCollection },
  { name: "personas", initializer: initPersonasCollection },
];

// Inicializar las colleciones si no existen.
for (const { name, initializer } of collections) if (!db.getCollection(name)) initializer(db);

// Exportarlas manualmente, para que sean visibles en los require.
export const frasesDB = db.getCollection<FrasesDB>("frases");
export const personasDB = db.getCollection<PersonasDB>("personas");
