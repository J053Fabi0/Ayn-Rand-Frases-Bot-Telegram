import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import getQueryParams from "../utils/getQueryParams.ts";
import Typography, { getTypographyClass } from "../components/Typography.tsx";
import { Head, Handlers, PageProps, BsCaretLeftFill, BsCaretRightFill } from "../deps.ts";
import { FullQuote, getFullQuotes, countQuotes } from "../controllers/mongo/quote.controller.ts";
import Pagination from "../components/Pagination.tsx";

interface IndexProps {
  page: number;
  limit: number;
  hasMore: boolean;
  isAdmin: boolean;
  pages: number[];
  fullQuotes: FullQuote[];
}

export const handler: Handlers<IndexProps, State> = {
  async GET(req, ctx) {
    const queryParams = getQueryParams(req.url);

    const page = !isNaN(+queryParams.page) ? +queryParams.page : 1;
    const limit = !isNaN(+queryParams.limit) ? +queryParams.limit : 10;

    const fullQuotes = await getFullQuotes(undefined, {
      limit,
      sort: { number: -1 },
      skip: (page - 1) * limit,
      projection: { number: 1 },
    });

    const quoteCount = await countQuotes();
    const hasMore = quoteCount > page * limit;

    const pages = Array.from({ length: Math.ceil(quoteCount / limit) }, (_, i) => i + 1);

    return ctx.render({ isAdmin: Boolean(ctx.state.authToken), fullQuotes, page, limit, hasMore, pages });
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

      {data.isAdmin ? (
        <AdminTools />
      ) : (
        <Typography variant="h4" class="mt-3">
          Subscribe for daily quotes with the Telegram bot{" "}
          <a href="https://t.me/FrasesDeAynRandBot" class="mt-3 underline" target="_blank">
            @FrasesDeAynRandBot
          </a>
        </Typography>
      )}

      <hr class="my-5" />

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

const AdminTools = () => (
  <>
    <Typography variant="h4" class="mt-2">
      New
    </Typography>

    <a href="/quote/new">
      <Button class="mt-3 mr-3" color="green">
        Quote
      </Button>
    </a>

    <a href="/source/new">
      <Button class="mt-3 mx-3" color="blue">
        Source
      </Button>
    </a>

    <a href="/author/new">
      <Button class="mt-3 mx-3" color="red">
        Author
      </Button>
    </a>
  </>
);
