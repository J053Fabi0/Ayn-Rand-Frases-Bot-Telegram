import db from "../initDatabase.ts";
import Author from "../types/collections/author.type.ts";

const authorModel = db.collection<Author>("authors");
export default authorModel;
