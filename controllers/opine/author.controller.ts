import {
  createAuthor,
  changeAuthor,
  getAuthors as getAuthorsCtrl,
  deleteAuthor as deleteAuthorCtrl,
} from "../mongo/author.controller.ts";
import { ObjectId } from "../../deps.ts";
import { countQuotes } from "../mongo/quote.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetAuthors, PostAuthor, PatchAuthor, DeleteAuthor } from "../../types/api/author.type.ts";

export const getAuthors = async (_: GetAuthors, res: CommonResponse) => {
  const authors = (await getAuthorsCtrl({})).map((a) => ({ id: a._id, name: a.name, numberOfQuotes: 0 }));

  await Promise.all(authors.map(async (a) => (a.numberOfQuotes = await countQuotes({ author: a.id }))));

  res.send({ message: authors });
};

export const postAuthor = async ({ body }: PostAuthor, res: CommonResponse) => {
  const author = await createAuthor(body);
  res.send({ message: author._id });
};

export const patchAuthor = async ({ body }: PatchAuthor, res: CommonResponse) => {
  const { _id, ...other } = body;

  const { modifiedCount } = await changeAuthor({ _id: new ObjectId(_id) }, { $set: other });
  if (modifiedCount === 0) throw new Error("No author found with that id.");

  res.sendStatus(200);
};

export const deleteAuthor = async ({ params }: DeleteAuthor, res: CommonResponse) => {
  const deletedCount = await deleteAuthorCtrl({ _id: new ObjectId(params._id) });
  if (deletedCount === 0) throw new Error("No author found with that id.");

  res.sendStatus(200);
};
