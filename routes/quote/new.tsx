import { AUTH_TOKEN } from "../../env.ts";
import { Head, Handlers, PageProps } from "../../deps.ts";
import { PostQuote } from "../../types/api/quote.type.ts";
import { Container } from "../../components/Container.tsx";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { postQuote } from "../../controllers/opine/quote.controller.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";

export interface IndexProps {
  authors: Author[];
  sources: Source[];
}

export const handler: Handlers<IndexProps> = {
  async GET(_, ctx) {
    const authors = await getAuthors();
    const sources = await getSources();

    return await ctx.render({ authors, sources });
  },

  async POST(req) {
    const form = await req.formData();
    const authToken = form.get("authToken")?.toString();
    if (authToken !== AUTH_TOKEN) return new Response("Unauthorized", { status: 401 });

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

export default function NewQuote({ data }: PageProps<IndexProps>) {
  return (
    <>
      <Head>
        <title>Publish quote</title>
      </Head>

      <Container>
        <div class="min-h-screen">
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

            <button class="mt-2 p-2 border border-gray-300 rounded" type="submit">
              Publish
            </button>
          </form>
        </div>

        {/* "Made with Fresh" logo */}
        <hr class="mb-4" />
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </Container>
    </>
  );
}
