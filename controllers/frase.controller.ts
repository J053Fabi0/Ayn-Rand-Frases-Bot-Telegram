import * as a from "./dbUtils.ts";
import Model from "../models/frase.model.ts";

export const getFrases = a.find(Model);
export const getFrase = a.findOne(Model);
export const getFraseById = a.findById(Model);

export const countFrases = a.count(Model);

export const createFrase = a.insertOne(Model);
export const createFrases = a.insertMany(Model);

export const changeFrase = a.updateOne(Model);
export const changeFrases = a.updateMany(Model);

export const deleteFrase = a.deleteOne(Model);
export const deleteFrases = a.deleteMany(Model);

export const aggregateFrase = a.aggregate(Model);
