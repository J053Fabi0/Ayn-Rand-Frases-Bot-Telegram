import {
  Filter,
  Collection,
  FindOptions,
  UpdateFilter,
  InsertOptions,
  UpdateOptions,
  InsertDocument,
} from "../deps.ts";
import InsertDoc from "../types/collections/insertDoc.type.ts";
import { ObjectId } from "https://deno.land/x/web_bson@v0.3.0/mod.js";
import CommonCollection from "../types/collections/commonCollection.type.ts";

type UnPromisify<T> = T extends Promise<infer U> ? U : T;
type DocumentOfCollection<T extends Collection<CommonCollection>> = Exclude<
  UnPromisify<ReturnType<T["findAndModify"]>>,
  undefined
>;

export function find<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<DocumentOfCollection<T>>, options?: FindOptions) =>
    collection.find(filter, options).toArray() as Promise<DocumentOfCollection<T>[]>;
}

export function findOne<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<DocumentOfCollection<T>>, options?: FindOptions) =>
    collection.findOne(filter, options).then((v) => v ?? null) as Promise<DocumentOfCollection<T> | null>;
}

export function findById<T extends Collection<CommonCollection>>(collection: T) {
  return (id: string | ObjectId, options?: FindOptions) =>
    collection
      .findOne({ _id: typeof id === "string" ? new ObjectId(id) : id }, options)
      .then((v) => v ?? null) as Promise<DocumentOfCollection<T> | null>;
}

export function insertOne<T extends Collection<CommonCollection>>(collection: T) {
  return async (doc: InsertDoc<DocumentOfCollection<T>>, options?: InsertOptions) => {
    // set createdAt and modifiedAt if they are not present
    const date = new Date();
    if (!doc.createdAt || typeof doc.createdAt !== "object" || !(doc.createdAt instanceof Date))
      doc.createdAt = date;
    if (!doc.modifiedAt || typeof doc.modifiedAt !== "object" || !(doc.modifiedAt instanceof Date))
      doc.modifiedAt = date;

    const _id = await collection.insertOne(doc as InsertDocument<CommonCollection>, options);

    return Object.assign({ _id }, doc as Required<typeof doc>);
  };
}

export function insertMany<T extends Collection<CommonCollection>>(collection: T) {
  return async (docs: InsertDoc<DocumentOfCollection<T>>[], options?: InsertOptions) => {
    // set createdAt and modifiedAt if they are not present
    const date = new Date();
    for (const doc of docs) {
      if (!doc.createdAt || typeof doc.createdAt !== "object" || !(doc.createdAt instanceof Date))
        doc.createdAt = date;
      if (!doc.modifiedAt || typeof doc.modifiedAt !== "object" || !(doc.modifiedAt instanceof Date))
        doc.modifiedAt = date;
    }

    const { insertedIds } = await collection.insertMany(docs as InsertDocument<CommonCollection>[], options);

    return insertedIds.map((id, i) => Object.assign({ _id: id }, docs[i] as Required<(typeof docs)[number]>));
  };
}

export function count<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<DocumentOfCollection<T>>, options?: FindOptions) =>
    collection.countDocuments(filter, options);
}

function updateCommon(
  type: "many" | "one",
  collection: Collection<CommonCollection>,
  filter: Filter<CommonCollection>,
  update: UpdateFilter<CommonCollection>,
  options?: UpdateOptions
) {
  if (update.$set && !update.$set.modifiedAt) update.$set.modifiedAt = new Date();
  else if (!update.$set) update.$set = { modifiedAt: new Date() };
  return collection[type === "many" ? "updateMany" : "updateOne"](filter, update, options);
}

export function updateOne<T extends Collection<CommonCollection>>(collection: T) {
  return (
    filter: Filter<DocumentOfCollection<T>>,
    update: UpdateFilter<DocumentOfCollection<T>>,
    options?: UpdateOptions
  ) => updateCommon("one", collection, filter, update, options);
}

export function updateMany<T extends Collection<CommonCollection>>(collection: T) {
  return (
    filter: Filter<DocumentOfCollection<T>>,
    update: UpdateFilter<DocumentOfCollection<T>>,
    options?: UpdateOptions
  ) => updateCommon("many", collection, filter, update, options);
}

export function deleteOne<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<DocumentOfCollection<T>>, options?: UpdateOptions) =>
    collection.deleteOne(filter, options);
}

export function deleteMany<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<DocumentOfCollection<T>>, options?: UpdateOptions) =>
    collection.deleteMany(filter, options);
}
