import { AUTH_TOKEN } from "../../env.ts";
import isMongoId from "../../utils/isMongoId.ts";
import Button from "../../components/Button.tsx";
import { H4 } from "../../components/Headers.tsx";
import { Checkbox } from "../../components/Checkbox.tsx";
import { Head, Handlers, PageProps } from "../../deps.ts";
import Author from "../../types/collections/author.type.ts";
import { PostSource } from "../../types/api/source.type.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { postSource } from "../../controllers/opine/source.controller.ts";

export interface NewSourceProps {
  authors: Author[];
}

export const handler: Handlers<NewSourceProps> = {
  async GET(_, ctx) {
    const authors = await getAuthors();
    return await ctx.render({ authors });
  },

  async POST(req) {
    const form = await req.formData();

    const source = form.get("source")?.toString();
    const authors = [...form.keys()].filter((key) => isMongoId(key));

    if (!source) return new Response("Missing source", { status: 400 });
    if (authors.length === 0) return new Response("Missing authors", { status: 400 });

    await postSource({ body: { authors, name: source } } as PostSource);

    // Redirect user to the quote page.
    const headers = new Headers();
    headers.set("location", `/quote/new`);
    return new Response(null, { status: 303, headers });
  },
};

export default function NewSource({ data }: PageProps<NewSourceProps>) {
  return (
    <>
      <Head>
        <title>New source</title>
      </Head>

      <H4 class="text-2xl">Publish a new source</H4>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
            type="text"
            name="source"
            placeholder="Source"
            class="my-2 p-2 border border-gray-300 rounded w-full"
          />

          {data.authors.map((author, i) => (
            <Checkbox inputId={`author-${i}`} name={author._id.toString()}>
              {author.name}
            </Checkbox>
          ))}
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 p-2" type="submit" color="blue">
            Publish
          </Button>
        </div>
      </form>
    </>
  );
}
