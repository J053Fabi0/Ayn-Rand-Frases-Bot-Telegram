import PersonasDB from "../../types/personasDB.type.ts";

const initPersonasCollection = (db: Loki) => db.addCollection<PersonasDB>("personas");

export default initPersonasCollection;
