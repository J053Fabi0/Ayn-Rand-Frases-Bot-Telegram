import { GetAuthors } from "../../types/api/author.type.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { getAuthors as getAuthorsCtrl } from "../mongo/author.controller.ts";

export const getAuthors = async (_: GetAuthors, res: CommonResponse) =>
  res.send({ message: (await getAuthorsCtrl({})).map((a) => ({ id: a._id, name: a.name })) });
