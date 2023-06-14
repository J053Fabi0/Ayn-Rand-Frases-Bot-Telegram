import redirect from "../../utils/redirect.ts";
import Button from "../../components/Button.tsx";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import getActionAndId from "../../utils/getActionAndId.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import isPromise from "../../types/typeGuards/isPromise.ts";
import isResponse from "../../types/typeGuards/isResponse.ts";
import { Head, Handlers, PageProps, RouteConfig } from "../../deps.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";
import { FullQuote, getFullQuote } from "../../controllers/mongo/quote.controller.ts";
import { postQuote, patchQuote, PostQuote, PatchQuote } from "../../controllers/opine/quote.controller.ts";

export const config: RouteConfig = {
  routeOverride: "/quote/(new|edit)/:id?",
};

interface NewQuoteProps {
  authors: Author[];
  sources: Source[];
  quote: FullQuote | null;
}

export const handler: Handlers<NewQuoteProps, State> = {
  async GET(req, ctx) {
    if (ctx.state.quoteExists === false) return ctx.renderNotFound();

    const groups = getActionAndId(req, ctx);

    if (isPromise(groups) || isResponse(groups)) return groups;

    const authors = await getAuthors();
    const sources = await getSources();

    if (!groups.id) return await ctx.render({ authors, sources, quote: null });

    const possibleQuote = await getFullQuote({ number: +groups.id });

    return ctx.render({ authors, sources, quote: possibleQuote });
  },

  async POST(req, ctx) {
    if (ctx.state.quoteExists === false) return ctx.renderNotFound();

    const groups = getActionAndId(req, ctx);
    if (isPromise(groups) || isResponse(groups)) return groups;

    const form = await req.formData();
    const quote = form.get("quote")?.toString();
    const authorId = form.get("author")?.toString();
    const sourceId = form.get("source")?.toString() || "null";

    if (!quote || !authorId) return new Response("Missing quote, author, or/and source", { status: 400 });

    let quoteNumber = +groups.id!;
    const data = { quote, authorId, sourceId: sourceId === "null" ? null : sourceId } satisfies
      | PostQuote
      | PatchQuote;

    // Edit quote
    if (groups.action === "edit") await patchQuote({ ...data, number: quoteNumber });
    // Publish new quote
    else quoteNumber = (await postQuote(data)).number;

    // Redirect user to the quote page.
    return redirect(`/quote/${quoteNumber}`);
  },
};

export default function NewQuote({ data: { quote, authors, sources } }: PageProps<NewQuoteProps>) {
  const editing = quote !== null;

  const sourcesWithNull = [...sources, { _id: "null", name: "No source", authors: authors.map((a) => a._id) }];

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
            rows={10}
            name="quote"
            placeholder="Quote"
            value={quote?.quote || ""}
            class="my-2 p-2 border border-gray-300 rounded w-full"
          />

          <AuthorSourceSelector
            authors={authors}
            sources={sourcesWithNull}
            authorId={`${quote?.author?._id || ""}`}
            sourceId={`${quote?.source?._id || ""}`}
          />
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 py-2 px-4 text-lg" type="submit" color="green">
            {editing ? "Save" : "Publish"}
          </Button>
        </div>
      </form>
    </>
  );
}
