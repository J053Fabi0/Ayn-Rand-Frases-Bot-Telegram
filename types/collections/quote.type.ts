import { ObjectId } from "../../deps.ts";
import { language } from "../languages.type.ts";
import CommonCollection from "./commonCollection.type.ts";

export default interface Quote extends CommonCollection {
  quote: string;
  number: number;
  author: ObjectId;
  timesSent: number;
  archived: boolean;
  lastSentTime: Date;
  language?: language;
  source: ObjectId | null;
  sourceDetails: string | null;
}
