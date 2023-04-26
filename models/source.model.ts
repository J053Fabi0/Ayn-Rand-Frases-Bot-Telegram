import db from "../initDatabase.ts";
import Source from "../types/collections/source.type.ts";

const quoteModel = db.collection<Source>("sources");
export default quoteModel;
