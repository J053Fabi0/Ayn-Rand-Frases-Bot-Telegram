import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import { GetQuotes } from "../../types/api/quote.type.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { getQuotes as getQuotesCtrl } from "../mongo/quote.controller.ts";

export const getQuotes = async ({ params }: GetQuotes, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const quotes = pretifyIds(
    await getQuotesCtrl({ author: new ObjectId(params.authorId) }, { projection: { author: 0 } })
  );

  res.send({ message: quotes });
};
