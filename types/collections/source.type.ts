import { ObjectId } from "../../deps.ts";
import CommonCollection from "./commonCollection.type.ts";

export default interface Source extends CommonCollection {
  name: string;
  authors: ObjectId[];
  url?: string | null;
}
