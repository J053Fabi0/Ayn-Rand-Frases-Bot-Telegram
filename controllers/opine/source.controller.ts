import {
  createSource,
  changeSource,
  getSources as getSourcesCtrl,
  deleteSource as deleteSourceCtrl,
} from "../mongo/source.controller.ts";
import { ObjectId } from "../../deps.ts";
import { pretifyIds } from "../../utils/pretifyId.ts";
import Source from "../../types/collections/source.type.ts";
import { getAuthorById } from "../mongo/author.controller.ts";
import CommonResponse from "../../types/commonResponse.type.ts";
import { GetSources, PostSource, PatchSource, DeleteSource } from "../../types/api/source.type.ts";

export const getSources = async ({ params }: GetSources, res: CommonResponse) => {
  const author = await getAuthorById(params.authorId, { projection: { _id: 1 } });
  if (!author) res.setStatus(404).send({ message: null, error: "Author not found" });

  const sources = pretifyIds(
    await getSourcesCtrl({ authors: new ObjectId(params.authorId) }, { projection: { name: 1, authors: 1 } })
  );

  res.send({ message: sources });
};

export const postSource = async ({ body }: PostSource, res?: CommonResponse) => {
  for (const authorId of body.authors) {
    const author = await getAuthorById(authorId, { projection: { _id: 1 } });
    if (!author) res?.setStatus(404).send({ message: null, error: `Author not found (${authorId})` });
  }

  const source = await createSource({
    name: body.name,
    authors: body.authors.map((author) => new ObjectId(author)),
  });

  res?.send({ message: source._id });

  return source;
};

export const patchSource = async ({ body }: PatchSource, res?: CommonResponse) => {
  const { sourceId, authors, name } = body;

  const patchData = {} as Partial<Source>;

  if (name) patchData.name = name;

  if (authors) {
    for (const authorId of authors) {
      const author = await getAuthorById(authorId, { projection: { _id: 1 } });
      if (!author)
        return void res?.setStatus(404).send({ message: null, error: `Author not found (${authorId})` });
    }

    patchData.authors = authors.map((author) => new ObjectId(author));
  }

  const results = await changeSource({ _id: new ObjectId(sourceId) }, { $set: patchData });

  if (!results.matchedCount) res?.setStatus(404).send({ message: null, error: "Source not found" });
  else res?.sendStatus(200);

  return results;
};

export const deleteSource = async ({ params }: DeleteSource, res: CommonResponse) => {
  const deletedCount = await deleteSourceCtrl({ _id: new ObjectId(params._id) });
  if (deletedCount === 0) res.setStatus(404).send({ message: null, error: "Source not found" });

  res.sendStatus(200);
};
