import redirect from "../../utils/redirect.ts";
import Typography from "../../components/Typography.tsx";
import { Checkbox } from "../../components/Checkbox.tsx";
import getActionAndId from "../../utils/getActionAndId.ts";
import Author from "../../types/collections/author.type.ts";
import isMongoId from "../../types/typeGuards/isMongoId.ts";
import isPromise from "../../types/typeGuards/isPromise.ts";
import Source from "../../types/collections/source.type.ts";
import isResponse from "../../types/typeGuards/isResponse.ts";
import Button, { getButtonClasses } from "../../components/Button.tsx";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { Head, Handlers, PageProps, RouteConfig, ObjectId, FiTrash2 } from "../../deps.ts";
import { changeSource, createSource, getSource } from "../../controllers/mongo/source.controller.ts";

export const config: RouteConfig = {
  routeOverride: "/source/(new|edit)/:id?",
};

export interface NewSourceProps {
  authors: Author[];
  source: Source | null;
}

export const handler: Handlers<NewSourceProps> = {
  async GET(req, ctx) {
    const groups = getActionAndId(req, ctx);

    if (isPromise(groups) || isResponse(groups)) return groups;

    const authors = await getAuthors();

    if (!groups.id) return ctx.render({ authors, source: null });

    if (!isMongoId(groups.id)) throw new Error(`Invalid source id: ${groups.id}`);

    const possibleSource = await getSource({ _id: new ObjectId(groups.id) });
    if (!possibleSource) throw new Error(`Source not found: ${groups.id}`);

    return ctx.render({ authors, source: possibleSource });
  },

  async POST(req, ctx) {
    const groups = getActionAndId(req, ctx);

    if (isPromise(groups) || isResponse(groups)) return groups;

    const form = await req.formData();

    const url = form.get("url")?.toString();
    const source = form.get("source")?.toString();
    const authors = [...form.keys()].filter((key) => isMongoId(key)).map((id) => new ObjectId(id));

    if (!source) return new Response("Missing source", { status: 400 });
    if (authors.length === 0) return new Response("Missing authors", { status: 400 });

    const data = { url: url || null, name: source, authors };

    if (groups.action === "new") {
      await createSource(data);
      return redirect("/quote/new");
    }

    await changeSource({ _id: new ObjectId(groups.id) }, { $set: data });
    return redirect(`/sources`);
  },
};

export default function NewSource({ data: { authors, source } }: PageProps<NewSourceProps>) {
  const editing = source !== null;

  return (
    <>
      <Head>
        <title>{editing ? "Edit" : "Publish"} source</title>
      </Head>

      <Typography variant="h4" class="text-2xl">
        {editing ? "Edit" : "Publish a new"} source
      </Typography>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
            type="text"
            name="source"
            placeholder="Source"
            value={source?.name ?? ""}
            class="my-2 p-2 border border-gray-300 rounded w-full"
          />

          <input
            name="url"
            type="url"
            placeholder="URL"
            pattern="https://.*"
            value={source?.url ?? ""}
            class="my-2 p-2 border border-gray-300 rounded w-full"
          />

          {authors.map((author, i) => (
            <Checkbox
              name={`${author._id}`}
              inputId={`author-${i}`}
              checked={source?.authors.map((a) => `${a}`).includes(`${author._id}`) ?? false}
            >
              {author.name}
            </Checkbox>
          ))}
        </div>

        <div class="mt-3 flex justify-center align-center items-center mt-2 gap-4">
          <Button class="py-2 px-4 text-lg" type="submit" color="green">
            {editing ? "Save" : "Publish"}
          </Button>
          {editing && (
            <a href={`/source/delete/${source._id}`} class={getButtonClasses("red")}>
              <FiTrash2 size={16} />
            </a>
          )}
        </div>
      </form>
    </>
  );
}
