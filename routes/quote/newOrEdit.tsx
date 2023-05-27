import Button from "../../components/Button.tsx";
import isMongoId from "../../utils/isMongoId.ts";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import { PostQuote } from "../../types/api/quote.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { postQuote } from "../../controllers/opine/quote.controller.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";
import { Head, Handlers, PageProps, RouteConfig, ObjectId } from "../../deps.ts";
import { FullQuote, getFullQuote } from "../../controllers/mongo/quote.controller.ts";

export const config: RouteConfig = {
  routeOverride: "/quote/(new|edit)/:id?",
};
const urlPattern = new URLPattern({ pathname: "/quote/:action/:id?" });

interface NewQuoteProps {
  authors: Author[];
  sources: Source[];
  quote?: FullQuote | null;
}

export const handler: Handlers<NewQuoteProps, State> = {
  async GET(req, ctx) {
    const groups = urlPattern.exec(req.url)!.pathname.groups as { action: "edit" | "new"; id?: string };

    // only allow /quote/new and /quote/edit/:id
    if (groups.action === "edit" && !groups.id) return ctx.renderNotFound();
    if (groups.action === "new" && groups.id) return ctx.renderNotFound();

    const authors = await getAuthors();
    const sources = await getSources();

    if (!groups.id) return await ctx.render({ authors, sources });

    const possibleQuote = await getFullQuote(
      isMongoId(groups.id) ? { _id: new ObjectId(groups.id) } : { number: parseInt(groups.id) }
    );

    return ctx.render({ authors, sources, quote: possibleQuote });
  },

  async POST(req) {
    const form = await req.formData();

    const quote = form.get("quote")?.toString();
    const authorId = form.get("author")?.toString();
    const sourceId = form.get("source")?.toString();

    if (!quote || !authorId || !sourceId) return new Response("Missing quote, author, or source", { status: 400 });

    const newQuote = await postQuote({
      body: { quote, authorId, sourceId: sourceId === "null" ? null : sourceId },
    } as PostQuote);

    // Redirect user to the quote page.
    const headers = new Headers();
    headers.set("location", `/quote/${newQuote._id}`);
    return new Response(null, { status: 303, headers });
  },
};

export default function NewQuote({ data }: PageProps<NewQuoteProps>) {
  const { quote } = data;
  const editing = quote !== undefined;

  if (quote === null)
    return (
      <>
        <Head>
          <title>Quote not found</title>
        </Head>
        <Typography variant="h4">Quote not found</Typography>
      </>
    );

  return (
    <>
      <Head>
        <title>{editing ? "Edit" : "Publish"} quote</title>
      </Head>

      <Typography variant="h4">{editing ? "Edit" : "Publish a new"} quote</Typography>

      <form method="post">
        <div class="flex flex-col">
          <textarea
            required
            value={quote?.quote || ""}
            rows={10}
            name="quote"
            placeholder="Quote"
            class="mt-2 p-2 border border-gray-300 rounded w-full"
          />

          <AuthorSourceSelector {...data} authorId={`${quote?.author?._id}`} sourceId={`${quote?.source?._id}`} />
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
