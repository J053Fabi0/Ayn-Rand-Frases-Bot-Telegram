import redirect from "../../utils/redirect.ts";
import Button from "../../components/Button.tsx";
import Typography from "../../components/Typography.tsx";
import { Checkbox } from "../../components/Checkbox.tsx";
import getActionAndId from "../../utils/getActionAndId.ts";
import Author from "../../types/collections/author.type.ts";
import isMongoId from "../../types/typeGuards/isMongoId.ts";
import isPromise from "../../types/typeGuards/isPromise.ts";
import Source from "../../types/collections/source.type.ts";
import isResponse from "../../types/typeGuards/isResponse.ts";
import { getSource } from "../../controllers/mongo/source.controller.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { postSource } from "../../controllers/opine/source.controller.ts";
import { Head, Handlers, PageProps, RouteConfig, ObjectId } from "../../deps.ts";

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

  async POST(req) {
    const form = await req.formData();

    const source = form.get("source")?.toString();
    const authors = [...form.keys()].filter((key) => isMongoId(key));

    if (!source) return new Response("Missing source", { status: 400 });
    if (authors.length === 0) return new Response("Missing authors", { status: 400 });

    await postSource({ body: { authors, name: source } });

    // Redirect user to the quote page.
    return redirect("/quote/new");
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

          {authors.map((author, i) => (
            <Checkbox
              inputId={`author-${i}`}
              name={author._id.toString()}
              checked={source?.authors.map((a) => `${a}`).includes(`${author._id}`) ?? false}
            >
              {author.name}
            </Checkbox>
          ))}
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 py-2 px-4 text-lg" type="submit" color="green">
            {editing ? "Edit" : "Publish"}
          </Button>
        </div>
      </form>
    </>
  );
}
