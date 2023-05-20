import * as a from "./dbUtils.ts";
import Model from "../../models/source.model.ts";

export const getSources = a.find(Model);
export const getSource = a.findOne(Model);
export const getSourceById = a.findById(Model);

export const countSources = a.count(Model);

export const createSource = a.insertOne(Model);
export const createSources = a.insertMany(Model);

export const changeSource = a.updateOne(Model);
export const changeSources = a.updateMany(Model);

export const deleteSource = a.deleteOne(Model);
export const deleteSources = a.deleteMany(Model);

export const aggregateSource = a.aggregate(Model);
