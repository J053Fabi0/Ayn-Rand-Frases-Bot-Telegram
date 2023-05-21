import { AUTH_TOKEN } from "../../env.ts";
import Button from "../../components/Button.tsx";
import { PostQuote } from "../../types/api/quote.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { Head, Handlers, PageProps, compare } from "../../deps.ts";
import { postQuote } from "../../controllers/opine/quote.controller.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";

export interface NewQuoteProps {
  authors: Author[];
  sources: Source[];
}

export const handler: Handlers<NewQuoteProps> = {
  async GET(_, ctx) {
    const authors = await getAuthors();
    const sources = await getSources();

    return await ctx.render({ authors, sources });
  },

  async POST(req) {
    const form = await req.formData();
    const authToken = form.get("authToken")?.toString();
    if (!authToken) return new Response("Missing auth token", { status: 401 });
    if (!(await compare(authToken, AUTH_TOKEN))) return new Response("Unauthorized", { status: 401 });

    const quote = form.get("quote")?.toString();
    const authorId = form.get("author")?.toString();
    const sourceId = form.get("source")?.toString();

    if (!quote || !authorId || !sourceId) return new Response("Missing quote, author, or source", { status: 400 });

    const newQuote = await postQuote({ body: { quote, authorId, sourceId } } as PostQuote);

    // Redirect user to the quote page.
    const headers = new Headers();
    headers.set("location", `/quote/${newQuote._id}`);
    return new Response(null, { status: 303, headers });
  },
};

export default function NewQuote({ data }: PageProps<NewQuoteProps>) {
  return (
    <>
      <Head>
        <title>Publish quote</title>
      </Head>

      <h1 class="text-2xl">Publish a new quote</h1>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
            type="password"
            name="authToken"
            placeholder="Auth token"
            class="mt-2 p-2 border border-gray-300 rounded w-full"
          />

          <textarea
            required
            rows={6}
            name="quote"
            placeholder="Quote"
            class="mt-2 p-2 border border-gray-300 rounded w-full"
          />

          <AuthorSourceSelector authors={data.authors} sources={data.sources} />
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
