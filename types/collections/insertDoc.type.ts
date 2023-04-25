import { InsertDocument, ObjectId } from "../../deps.ts";
import CommonCollection from "./commonCollection.type.ts";

type InsertDoc<T = CommonCollection> = InsertDocument<
  Omit<T, keyof CommonCollection> & { createdAt?: Date; modifiedAt?: Date; _id: ObjectId }
>;

export default InsertDoc;
