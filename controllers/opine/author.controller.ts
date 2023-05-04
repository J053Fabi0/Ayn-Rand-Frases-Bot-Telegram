import { countQuotes } from "../mongo/quote.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetAuthors, PostAuthor } from "../../types/api/author.type.ts";
import { getAuthors as getAuthorsCtrl, createAuthor } from "../mongo/author.controller.ts";

export const getAuthors = async (_: GetAuthors, res: CommonResponse) => {
  const authors = (await getAuthorsCtrl({})).map((a) => ({ id: a._id, name: a.name, numberOfQuotes: 0 }));

  await Promise.all(authors.map(async (a) => (a.numberOfQuotes = await countQuotes({ author: a.id }))));

  res.send({ message: authors });
};

export const postAuthor = async ({ body }: PostAuthor, res: CommonResponse) => {
  const author = await createAuthor(body);
  res.send({ message: author._id });
};
