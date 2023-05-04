import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetSources, PostSource, PatchSource } from "../../types/api/source.type.ts";
import { getSources as getSourcesCtrl, createSource, changeSource } from "../mongo/source.controller.ts";

export const getSources = async ({ params }: GetSources, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const sources = pretifyIds(
    await getSourcesCtrl({ authors: new ObjectId(params.authorId) }, { projection: { name: 1, authors: 1 } })
  );

  res.send({ message: sources });
};

export const postSource = async ({ body }: PostSource, res: CommonResponse) => {
  for (const authorId of body.authors) {
    const author = await getAuthorById(authorId, { projection: { _id: 1 } });
    if (!author) res.setStatus(404).send({ message: null, error: `Author not found (${authorId})` });
  }

  const source = await createSource({
    name: body.name,
    authors: body.authors.map((author) => new ObjectId(author)),
  });

  res.send({ message: source._id });
};

export const patchSource = async ({ body }: PatchSource, res: CommonResponse) => {
  const { sourceId, authors, ...patchData } = body;

  if (authors) {
    for (const authorId of authors) {
      const author = await getAuthorById(authorId, { projection: { _id: 1 } });
      if (!author) res.setStatus(404).send({ message: null, error: `Author not found (${authorId})` });
    }
  }

  const { matchedCount } = await changeSource(
    { _id: new ObjectId(sourceId) },
    { $set: { ...patchData, ...(authors ? { authors: authors.map((id) => new ObjectId(id)) } : {}) } }
  );

  if (!matchedCount) res.setStatus(404).send({ message: null, error: "Source not found" });

  res.sendStatus(200);
};
