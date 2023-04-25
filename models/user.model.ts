import db from "../initDatabase.ts";
import User from "../types/collections/user.type.ts";

const userModel = db.collection<User>("users");
export default userModel;
