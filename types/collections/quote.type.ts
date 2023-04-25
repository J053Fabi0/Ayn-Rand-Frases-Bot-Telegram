import CommonCollection from "./commonCollection.type.ts";

export default interface Quote extends CommonCollection {
  quote: string;
  number: number;
  timesSent: number;
  lastSentTime: Date;
}
