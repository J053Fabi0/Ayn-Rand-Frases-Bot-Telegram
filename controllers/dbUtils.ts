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

export function findOne<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<Exclude<UnPromisify<ReturnType<T["findOne"]>>, undefined>>, options?: FindOptions) =>
    collection.findOne(filter, options).then((v) => v ?? null);
}

export function find<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<Exclude<UnPromisify<ReturnType<T["find"]>>, undefined>>, options?: FindOptions) =>
    collection.find(filter, options).toArray();
}

export function findById<T extends Collection<CommonCollection>>(collection: T) {
  return (id: string | ObjectId, options?: FindOptions) =>
    collection.findOne({ _id: typeof id === "string" ? new ObjectId(id) : id }, options).then((v) => v ?? null);
}

export function insertOne<T extends Collection<CommonCollection>>(collection: T) {
  return async (
    doc: InsertDoc<Exclude<UnPromisify<ReturnType<T["findAndModify"]>>, undefined>>,
    options?: InsertOptions
  ) => {
    // set createdAt and modifiedAt if they are not present
    const date = new Date();
    if (!doc.createdAt) doc.createdAt = date;
    if (!doc.modifiedAt) doc.modifiedAt = date;

    const _id = await collection.insertOne(doc as InsertDocument<CommonCollection>, options);

    return Object.assign({ _id }, doc as Required<typeof doc>);
  };
}

export function insertMany<T extends Collection<CommonCollection>>(collection: T) {
  return async (
    docs: InsertDoc<Exclude<UnPromisify<ReturnType<T["findAndModify"]>>, undefined>>[],
    options?: InsertOptions
  ) => {
    // set createdAt and modifiedAt if they are not present
    const date = new Date();
    for (const doc of docs) {
      if (!doc.createdAt) doc.createdAt = date;
      if (!doc.modifiedAt) doc.modifiedAt = date;
    }

    const { insertedIds } = await collection.insertMany(docs as InsertDocument<CommonCollection>[], options);

    return insertedIds.map((id, i) => Object.assign({ _id: id }, docs[i] as Required<(typeof docs)[number]>));
  };
}

export function count<T extends Collection<CommonCollection>>(collection: T) {
  return (filter?: Filter<Exclude<UnPromisify<ReturnType<T["count"]>>, undefined>>, options?: FindOptions) =>
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
  return (filter: Filter<CommonCollection>, update: UpdateFilter<CommonCollection>, options?: UpdateOptions) =>
    updateCommon("one", collection, filter, update, options);
}

export function updateMany<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<CommonCollection>, update: UpdateFilter<CommonCollection>, options?: UpdateOptions) =>
    updateCommon("many", collection, filter, update, options);
}

export function deleteOne<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<CommonCollection>, options?: UpdateOptions) => collection.deleteOne(filter, options);
}

export function deleteMany<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<CommonCollection>, options?: UpdateOptions) => collection.deleteMany(filter, options);
}
