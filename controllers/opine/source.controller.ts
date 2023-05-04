import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import { GetSources } from "../../types/api/source.type.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { getSources as getSourcesCtrl } from "../mongo/source.controller.ts";

export const getSources = async ({ params }: GetSources, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const sources = pretifyIds(
    await getSourcesCtrl({ authors: new ObjectId(params.authorId) }, { projection: { name: 1, authors: 1 } })
  );

  res.send({ message: sources });
};
