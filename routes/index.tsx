import { WEBSITE_URL } from "../env.ts";
import Metas from "../components/Metas.tsx";
import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import Pagination from "../components/Pagination.tsx";
import AdminTools from "../components/AdminTools.tsx";
import getQueryParams from "../utils/getQueryParams.ts";
import checkPageParam from "../utils/checkPageParam.ts";
import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
import isResponse from "../types/typeGuards/isResponse.ts";
import handlePostFilters from "../utils/handlePostFilters.ts";
import AuthorSourceSelector from "../islands/AuthorSourceSelector.tsx";
import { getAuthors } from "../controllers/mongo/author.controller.ts";
import { getSources } from "../controllers/mongo/source.controller.ts";
import Typography, { getTypographyClass } from "../components/Typography.tsx";
import normalizeAuthorsAndSources from "../utils/normalizeAuthorsAndSources.ts";
import { Head, Handlers, PageProps, AiOutlineSearch, ObjectId } from "../deps.ts";
import { FullQuote, getFullQuotes, countQuotes } from "../controllers/mongo/quote.controller.ts";

interface IndexProps {
  page: number;
  limit: number;
  pages: number[];
  hasMore: boolean;
  isAdmin: boolean;
  sourceId: string;
  authorId: string;
  authors: Author[];
  sources: Source[];
  fullQuotes: FullQuote[];
}

const limit = 12;

export const handler: Handlers<IndexProps, State> = {
  async GET(req, ctx) {
    const queryParams = getQueryParams(req.url) as { page?: string };

    const { authorId = "all", sourceId = "all" } = ctx.state;

    const filter: Parameters<typeof getFullQuotes>[0] = {};
    if (authorId !== "all") filter.author = new ObjectId(authorId);
    if (sourceId !== "all") filter.source = sourceId === "null" ? null : new ObjectId(sourceId);

    const quoteCount = await countQuotes(filter);
    const pages = Array.from({ length: Math.ceil(quoteCount / limit) }, (_, i) => i + 1);

    const page = checkPageParam("", queryParams, pages);
    if (isResponse(page)) return page;

    const fullQuotes = await getFullQuotes(filter, {
      limit,
      sort: { number: -1 },
      skip: (page - 1) * limit,
      projection: { number: 1 },
    });

    return ctx.render({
      hasMore: quoteCount > page * limit,
      isAdmin: Boolean(ctx.state.authToken),
      ...{ page, limit, pages, fullQuotes, authorId, sourceId },
      authors: await getAuthors({}, { projection: { _id: 1, name: 1 } }),
      sources: await getSources({}, { projection: { _id: 1, name: 1, authors: 1 } }),
    });
  },

  POST(req) {
    return handlePostFilters("/", req);
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  const { authorId, sourceId } = data;
  const { sources, authors } = normalizeAuthorsAndSources(data.authors, data.sources);

  return (
    <>
      <Head>
        <Metas
          title="Objectivism quotes"
          image={`${WEBSITE_URL}/favicon/ms-icon-310x310.png`}
          description="The best quotes from the Objectivist philosopher Ayn Rand and other Objectivist philosophers."
        />
      </Head>

      {data.isAdmin ? (
        <AdminTools />
      ) : (
        <Typography variant="h4">
          Subscribe for daily quotes with the Telegram bot{" "}
          <a href="https://t.me/FrasesDeAynRandBot" class="mt-3 underline" target="_blank">
            @FrasesDeAynRandBot
          </a>
        </Typography>
      )}

      <hr class="my-4" />

      <form method="post" class="flex gap-3 w-full mb-3">
        <AuthorSourceSelector authors={authors} sources={sources} authorId={authorId} sourceId={sourceId} />

        <Button color="green" type="submit">
          <AiOutlineSearch size={20} />
        </Button>
      </form>

      <ul class="list-disc list-inside">
        {data.fullQuotes.map((quote) => (
          <li class={`mt-2 ${getTypographyClass()}`}>
            <a href={`/quote/${quote.number}`} class="underline">
              Quote #{quote.number}
            </a>
          </li>
        ))}
      </ul>

      <div class="flex justify-center mt-5">
        <Pagination pages={data.pages} baseUrl="/?page=" currentPage={data.page} maxPages={7} />
      </div>
    </>
  );
}
