import * as a from "./dbUtils.ts";
import Model from "../models/author.model.ts";

export const getAuthors = a.find(Model);
export const getAuthor = a.findOne(Model);
export const getAuthorById = a.findById(Model);

export const countAuthors = a.count(Model);

export const createAuthor = a.insertOne(Model);
export const createAuthors = a.insertMany(Model);

export const changeAuthor = a.updateOne(Model);
export const changeAuthors = a.updateMany(Model);

export const deleteAuthor = a.deleteOne(Model);
export const deleteAuthors = a.deleteMany(Model);

export const aggregateAuthor = a.aggregate(Model);
