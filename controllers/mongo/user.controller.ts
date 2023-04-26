import * as a from "./dbUtils.ts";
import Model from "../../models/user.model.ts";

export const getUsers = a.find(Model);
export const getUser = a.findOne(Model);
export const getUserById = a.findById(Model);

export const countUsers = a.count(Model);

export const createUser = a.insertOne(Model);
export const createUsers = a.insertMany(Model);

export const changeUser = a.updateOne(Model);
export const changeUsers = a.updateMany(Model);

export const deleteUser = a.deleteOne(Model);
export const deleteUsers = a.deleteMany(Model);

export const aggregateUser = a.aggregate(Model);
