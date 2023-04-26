import { ObjectId } from "../../deps.ts";
import CommonCollection from "./commonCollection.type.ts";

export default interface Quote extends CommonCollection {
  quote: string;
  number: number;
  author: ObjectId;
  timesSent: number;
  lastSentTime: Date;
}
