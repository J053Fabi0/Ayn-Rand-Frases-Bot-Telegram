import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import { getSourceById } from "../mongo/source.controller.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetQuotes, PostQuote } from "../../types/api/quote.type.ts";
import { getQuotes as getQuotesCtrl, createQuote, aggregateQuote } from "../mongo/quote.controller.ts";

export const getQuotes = async ({ params }: GetQuotes, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const quotes = pretifyIds(
    await getQuotesCtrl({ author: new ObjectId(params.authorId) }, { projection: { author: 0 } })
  );

  res.send({ message: quotes });
};

export const postQuote = async ({ body }: PostQuote, res: CommonResponse) => {
  const author = await getAuthorById(body.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  if (body.sourceId) {
    const source = await getSourceById(body.sourceId, { projection: { _id: 1 } });
    if (!source) res.setStatus(404).send({ message: null, error: "Source not found" });
  }

  const lastNumber =
    (await aggregateQuote([{ $group: { _id: null, number: { $max: "$number" } } }]))[0]?.number ?? 0;

  const quote = await createQuote({
    timesSent: 0,
    quote: body.quote,
    number: lastNumber + 1,
    lastSentTime: new Date(1),
    author: new ObjectId(body.authorId),
    source: body.sourceId ? new ObjectId(body.sourceId) : null,
  });

  res.send({ message: quote._id });
};
