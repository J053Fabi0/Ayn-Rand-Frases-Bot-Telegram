import db from "../initDatabase.ts";
import Author from "../types/collections/author.type.ts";

const authorType = db.collection<Author>("autores");
export default authorType;
