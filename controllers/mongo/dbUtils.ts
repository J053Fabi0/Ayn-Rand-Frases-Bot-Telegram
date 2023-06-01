import {
  Filter,
  ObjectId,
  Document,
  Collection,
  FindOptions,
  UpdateFilter,
  InsertOptions,
  UpdateOptions,
  InsertDocument,
  AggregateOptions,
  AggregatePipeline,
} from "../../deps.ts";
import InsertDoc from "../../types/collections/insertDoc.type.ts";
import CommonCollection from "../../types/collections/commonCollection.type.ts";

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

function addTimestamps(update: UpdateFilter<CommonCollection>) {
  if (update.$set && !update.$set.modifiedAt) update.$set.modifiedAt = new Date();
  else if (!update.$set) update.$set = { modifiedAt: new Date() };
}

export function updateOne<T extends Collection<CommonCollection>>(collection: T) {
  return (
    filter: Filter<DocumentOfCollection<T>>,
    update: UpdateFilter<DocumentOfCollection<T>>,
    options?: UpdateOptions
  ) => {
    addTimestamps(update);
    return collection.updateOne(filter, update, options);
  };
}

export function updateMany<T extends Collection<CommonCollection>>(collection: T) {
  return (
    filter: Filter<DocumentOfCollection<T>>,
    update: UpdateFilter<DocumentOfCollection<T>>,
    options?: UpdateOptions
  ) => {
    addTimestamps(update);
    return collection.updateMany(filter, update, options);
  };
}

export function deleteOne<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<DocumentOfCollection<T>>, options?: UpdateOptions) =>
    collection.deleteOne(filter, options);
}

export function deleteMany<T extends Collection<CommonCollection>>(collection: T) {
  return (filter: Filter<DocumentOfCollection<T>>, options?: UpdateOptions) =>
    collection.deleteMany(filter, options);
}

export interface AggregateOptionsExtended extends AggregateOptions {
  skip?: number;
  limit?: number;
  /**
   * The sort is done before the projection.
   */
  sort?: Document;
  projection?: Document;
}
export function aggregate<T extends Collection<CommonCollection>>(collection: T) {
  return (
    pipeline: AggregatePipeline<DocumentOfCollection<T>> | AggregatePipeline<DocumentOfCollection<T>>[],
    options?: AggregateOptionsExtended
  ) => {
    const finalPipeline = pipeline instanceof Array ? pipeline : [pipeline];

    const sort = options?.sort;
    if (sort) {
      delete options?.sort;
      finalPipeline.push({ $sort: sort });
    }

    const projection = options?.projection;
    if (projection) {
      delete options?.projection;
      finalPipeline.push({ $project: projection });
    }

    const skip = options?.skip;
    if (typeof skip === "number") {
      delete options?.skip;
      finalPipeline.push({ $skip: skip });
    }

    const limit = options?.limit;
    if (typeof limit === "number") {
      delete options?.limit;
      finalPipeline.push({ $limit: limit });
    }

    return collection.aggregate(finalPipeline, options).toArray();
  };
}
