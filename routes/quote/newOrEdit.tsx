import redirect from "../../utils/redirect.ts";
import Button from "../../components/Button.tsx";
import isMongoId from "../../utils/isMongoId.ts";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import { PostQuote, PatchQuote } from "../../types/api/quote.type.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";
import { Head, Handlers, PageProps, RouteConfig, ObjectId } from "../../deps.ts";
import { postQuote, patchQuote } from "../../controllers/opine/quote.controller.ts";
import { FullQuote, getFullQuote, getQuote } from "../../controllers/mongo/quote.controller.ts";

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

  async POST(req, ctx) {
    const groups = urlPattern.exec(req.url)!.pathname.groups as { action: "edit" | "new"; id?: string };

    const form = await req.formData();

    const quote = form.get("quote")?.toString();
    const authorId = form.get("author")?.toString();
    const sourceId = form.get("source")?.toString();

    if (!quote || !authorId || !sourceId) return new Response("Missing quote, author, or source", { status: 400 });

    let quoteId = groups.id ?? "";
    const body = { quote, authorId, sourceId: sourceId === "null" ? null : sourceId } satisfies (
      | PostQuote
      | PatchQuote
    )["body"];

    // Edit quote
    if (groups.action === "edit" && groups.id) {
      if (!isMongoId(groups.id)) {
        const quote = await getQuote({ number: parseInt(groups.id) });
        if (!quote) return ctx.renderNotFound();
        quoteId = `${quote._id}`;
      }

      const results = await patchQuote({ body: { ...body, quoteId } });
      if (results?.modifiedCount === 0) return ctx.renderNotFound();
    }
    // Publish new quote
    else if (groups.action === "new" && !groups.id) quoteId = `${(await postQuote({ body }))._id}`;
    // Invalid action
    else return ctx.renderNotFound();

    // Redirect user to the quote page.
    return redirect(`/quote/${quoteId}`);
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

          <AuthorSourceSelector
            {...data}
            authorId={`${quote?.author?._id || ""}`}
            sourceId={`${quote?.source?._id || ""}`}
          />
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
