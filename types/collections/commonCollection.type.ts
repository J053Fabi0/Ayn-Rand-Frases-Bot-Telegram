import { ObjectId } from "../../deps.ts";

export default interface CommonCollection {
  _id: ObjectId;
  createdAt: Date;
  modifiedAt: Date;
}
