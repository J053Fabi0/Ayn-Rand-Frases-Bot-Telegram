import Metas from "../../components/Metas.tsx";
import redirect from "../../utils/redirect.ts";
import Quote from "../../components/Quote.tsx";
import Button from "../../components/Button.tsx";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import LastSentTime from "../../islands/LastSentTime.tsx";
import getQueryParams from "../../utils/getQueryParams.ts";
import Author from "../../types/collections/author.type.ts";
import Source from "../../types/collections/source.type.ts";
import handlePostFilters from "../../utils/handlePostFilters.ts";
import { Handlers, Head, ObjectId, PageProps } from "../../deps.ts";
import AuthorSourceSelector from "../../islands/AuthorSourceSelector.tsx";
import { getAuthors } from "../../controllers/mongo/author.controller.ts";
import { getSources } from "../../controllers/mongo/source.controller.ts";
import normalizeAuthorsAndSources from "../../utils/normalizeAuthorsAndSources.ts";
import { FullQuote, getFullQuote, getFullQuotes } from "../../controllers/mongo/quote.controller.ts";
import { FiTrash2, BsCaretLeftFill, BsCaretRightFill, AiFillEdit, AiOutlineSearch } from "../../deps.ts";
import { QuotesWithoutSource, getQuotesWithoutSource } from "../../controllers/mongo/quote.controller.ts";

interface QuoteProps {
  next: number;
  previous: number;
  isAdmin: boolean;
  sourceId: string;
  authorId: string;
  authors: Author[];
  sources: Source[];
  quoteObj: FullQuote;
  quotesWithoutSource: QuotesWithoutSource;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(req, ctx) {
    const { id } = ctx.params;
    const isAdmin = Boolean(ctx.state.authToken);
    const { authorId = "all", sourceId = "all" } = ctx.state;
    const latestIfNotFound = Object.keys(getQueryParams(req.url)).includes("latestIfNotFound");

    if (!ctx.state.quoteExists) return ctx.renderNotFound();

    const possibleQuote = (await getFullQuote({ number: parseInt(id) })) as FullQuote;

    const filter: Parameters<typeof getFullQuotes>[0] = {};
    if (authorId !== "all") filter.author = new ObjectId(authorId);
    if (sourceId !== "all") filter.source = sourceId === "null" ? null : new ObjectId(sourceId);

    // group all authors and count how many quotes they have with source = null
    const quotesWithoutSource = await getQuotesWithoutSource();
    const fullQuotes = (await getFullQuotes(filter, { projection: { number: 1 } })).map((q) => q.number);

    const index = fullQuotes.indexOf(possibleQuote.number);

    // if the current quote is not in the list of quotes with the current filters
    // and the latestIfNotFound query param is present, redirect to the latest quote
    if (latestIfNotFound && index === -1) return redirect(`/quote/${fullQuotes[0]}`);
    // remove latestIfNotFound query param
    else if (latestIfNotFound) return redirect(`/quote/${id}`);

    const next = index > 0 ? fullQuotes[index - 1] : fullQuotes[fullQuotes.length - 1];
    const previous = index < fullQuotes.length - 1 ? fullQuotes[index + 1] : fullQuotes[0];

    return await ctx.render({
      next,
      isAdmin,
      authorId,
      sourceId,
      quotesWithoutSource,
      quoteObj: possibleQuote,
      previous: fullQuotes.length === 2 ? possibleQuote.number : previous,
      authors: await getAuthors({}, { projection: { _id: 1, name: 1 } }),
      sources: await getSources({}, { projection: { _id: 1, name: 1, authors: 1 } }),
    });
  },

  POST(req, ctx) {
    const { id } = ctx.params;
    return handlePostFilters(`/quote/${id}?latestIfNotFound`, req);
  },
};

export default function QuotePage({ data }: PageProps<QuoteProps>) {
  const { quoteObj, next, previous, isAdmin, authorId, sourceId, quotesWithoutSource } = data;

  const author = quoteObj.author?.name || "Unknown";
  const quote = quoteObj.quote.replace(/\n/g, " ");

  const description = quote.slice(0, 50) + (quote.length > 50 ? "…" : "");

  const { sources, authors } = normalizeAuthorsAndSources(data.authors, data.sources, quotesWithoutSource);

  return (
    <>
      <Head>
        <Metas description={description} title={`Quote from ${author}`} />
      </Head>

      {/* Quote */}
      <div class="flex justify-center">
        <div class="max-w-screen-sm">
          <Quote quote={quoteObj} />
        </div>
      </div>

      {/* Buttons */}
      <div class="flex justify-center mt-9">
        {/* Previous */}
        {previous !== quoteObj.number && (
          <a href={`/quote/${previous}`} alt={`Quote #${previous}`}>
            <Button class="mr-3 flex items-center" color="green">
              <BsCaretLeftFill size={16} /> #{previous}
            </Button>
          </a>
        )}

        {/* Edit and delete */}
        {isAdmin && (
          <>
            <a href={`/quote/edit/${quoteObj.number}`}>
              <Button color="blue" class="mr-3">
                <AiFillEdit size={16} />
              </Button>
            </a>
            <a href={`/quote/delete/${quoteObj.number}`}>
              <Button class="mr-3" type="submit" color="red">
                <FiTrash2 size={16} />
              </Button>
            </a>
          </>
        )}

        {/* Next */}
        {next !== quoteObj.number && (
          <a href={`/quote/${next}`} alt={`Quote #${next}`}>
            <Button color="green" class="flex items-center">
              #{next} <BsCaretRightFill size={16} />
            </Button>
          </a>
        )}
      </div>

      {/* Sent time */}
      <div class="flex justify-center">
        <div class="max-w-screen-sm w-full">
          <hr class="my-5" />

          <form method="post" class="flex gap-3 w-full mb-3">
            <AuthorSourceSelector authors={authors} sources={sources} authorId={authorId} sourceId={sourceId} />

            <Button color="green" type="submit">
              <AiOutlineSearch size={20} />
            </Button>
          </form>

          <Typography variant="h6" class="mt-5">
            Sent {quoteObj.timesSent} time{quoteObj.timesSent === 1 ? "" : "s"}
          </Typography>
          {quoteObj.timesSent > 0 && (
            <Typography class="mt-1">
              <LastSentTime dateToParse={+quoteObj.lastSentTime} />
            </Typography>
          )}
        </div>
      </div>
    </>
  );
}
