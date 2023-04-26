import { countQuotes } from "../mongo/quote.controller.ts";
import { GetAuthors } from "../../types/api/author.type.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { getAuthors as getAuthorsCtrl } from "../mongo/author.controller.ts";

export const getAuthors = async (_: GetAuthors, res: CommonResponse) => {
  const authors = (await getAuthorsCtrl({})).map((a) => ({ id: a._id, name: a.name, numberOfQuotes: 0 }));

  await Promise.all(authors.map(async (a) => (a.numberOfQuotes = await countQuotes({ author: a.id }))));

  res.send({ message: authors });
};
