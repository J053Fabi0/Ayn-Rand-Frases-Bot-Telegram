import db from "../initDatabase.ts";
import Quote from "../types/collections/quote.type.ts";

const quoteModel = db.collection<Quote>("quotes");
export default quoteModel;
