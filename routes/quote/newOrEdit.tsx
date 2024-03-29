import redirect from "../../utils/redirect.ts";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import getActionAndId from "../../utils/getActionAndId.ts";
import { isLanguage } from "../../types/languages.type.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import isPromise from "../../types/typeGuards/isPromise.ts";
import isResponse from "../../types/typeGuards/isResponse.ts";
import NewOrEditQuote from "../../islands/NewOrEditQuote.tsx";
import { Head, Handlers, PageProps, RouteConfig } from "../../deps.ts";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import { FullQuote, getFullQuote } from "../../controllers/mongo/quote.controller.ts";
import { postQuote, patchQuote, PostQuote, PatchQuote } from "../../controllers/opine/quote.controller.ts";

export const config: RouteConfig = {
  routeOverride: "/quote/(new|edit)/:id?",
};

export interface NewQuoteProps {
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
    const language = form.get("language")?.toString();
    const sourceId = form.get("source")?.toString() || "null";
    const sourceDetails = form.get("sourceDetails")?.toString() || "";

    if (!language || !isLanguage(language)) return new Response("Invalid language", { status: 400 });
    if (!quote || !authorId) return new Response("Missing quote, author, or/and source", { status: 400 });

    let quoteNumber = +groups.id!;
    const data = {
      quote,
      authorId,
      language,
      sourceDetails,
      sourceId: sourceId === "null" ? null : sourceId,
    } satisfies PostQuote | PatchQuote;

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

  return (
    <>
      <Head>
        <title>{editing ? "Edit" : "Publish"} quote</title>
      </Head>

      <Typography variant="h4">{editing ? "Edit" : "Publish a new"} quote</Typography>

      <NewOrEditQuote authors={authors} quote={quote} sources={sources} />
    </>
  );
}
