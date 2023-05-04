import { ObjectId } from "../../deps.ts";
import { countQuotes } from "../mongo/quote.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetAuthors, PostAuthor, PatchAuthor } from "../../types/api/author.type.ts";
import { getAuthors as getAuthorsCtrl, createAuthor, changeAuthor } from "../mongo/author.controller.ts";

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
  const { id, ...other } = body;

  const { modifiedCount } = await changeAuthor({ _id: new ObjectId(id) }, { $set: other });
  if (modifiedCount === 0) throw new Error("No author found with that id.");

  res.sendStatus(200);
};
