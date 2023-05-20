import { ObjectId } from "../deps.ts";

interface Document {
  _id: ObjectId | string;
  // deno-lint-ignore no-explicit-any
  [key: string]: any;
}

type PretifyId<T extends Document> = Omit<T, "_id"> & { id: T["_id"] };

export function pretifyId<T extends Document>({ _id, ...rest }: T) {
  return Object.assign({ id: _id }, rest) as PretifyId<T>;
}

export function pretifyIds<T extends Document>(docs: T[]) {
  return docs.map((doc) => pretifyId(doc));
}
