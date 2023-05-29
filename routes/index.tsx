import redirect from "../utils/redirect.ts";
import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import Pagination from "../components/Pagination.tsx";
import getQueryParams from "../utils/getQueryParams.ts";
import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
import AuthorSourceSelector from "../islands/AuthorSourceSelector.tsx";
import { getAuthors } from "../controllers/mongo/author.controller.ts";
import { getSources } from "../controllers/mongo/source.controller.ts";
import { Head, Handlers, PageProps, AiOutlineSearch } from "../deps.ts";
import Typography, { getTypographyClass } from "../components/Typography.tsx";
import { FullQuote, getFullQuotes, countQuotes } from "../controllers/mongo/quote.controller.ts";

interface IndexProps {
  page: number;
  limit: number;
  pages: number[];
  hasMore: boolean;
  isAdmin: boolean;
  authors: Author[];
  sources: Source[];
  fullQuotes: FullQuote[];
}

const limit = 10;

export const handler: Handlers<IndexProps, State> = {
  async GET(req, ctx) {
    const queryParams = getQueryParams(req.url) as { page?: string };

    const quoteCount = await countQuotes();
    const pages = Array.from({ length: Math.ceil(quoteCount / limit) }, (_, i) => i + 1);

    if (queryParams.page && isNaN(+queryParams.page)) return redirect("/");

    const page = queryParams.page ? +queryParams.page : 1;
    if (!pages.includes(page)) return redirect(`/?page=${page <= 0 ? 1 : pages[pages.length - 1]}`);
    if (queryParams.page === "1") return redirect("/");

    const fullQuotes = await getFullQuotes(undefined, {
      limit,
      sort: { number: -1 },
      skip: (page - 1) * limit,
      projection: { number: 1 },
    });

    return ctx.render({
      page,
      limit,
      pages,
      fullQuotes,
      authors: await getAuthors(),
      sources: await getSources(),
      hasMore: quoteCount > page * limit,
      isAdmin: Boolean(ctx.state.authToken),
    });
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  const authors = [{ _id: "all", name: "All authors" }, ...data.authors];
  const sources = [{ _id: "all", name: "All sources", authors: authors.map((a) => a._id) }, ...data.sources];

  return (
    <>
      <Head>
        <title>Ayn Rand</title>
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
        <AuthorSourceSelector authors={authors} sources={sources} authorId="all" sourceId="all" />

        <Button color="green">
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

const AdminTools = () => (
  <>
    <Typography variant="h4" class="mb-2">
      New
    </Typography>

    <div class="flex flex-row flex-grap gap-2">
      <a href="/quote/new">
        <Button color="green">Quote</Button>
      </a>

      <a href="/source/new">
        <Button color="blue">Source</Button>
      </a>

      <a href="/author/new">
        <Button color="red">Author</Button>
      </a>
    </div>
  </>
);
