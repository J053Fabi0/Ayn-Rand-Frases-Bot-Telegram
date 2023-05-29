import Metas from "../components/Metas.tsx";
import redirect from "../utils/redirect.ts";
import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import Pagination from "../components/Pagination.tsx";
import getQueryParams from "../utils/getQueryParams.ts";
import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
import createSignedCookie from "../utils/createSignedCookie.ts";
import AuthorSourceSelector from "../islands/AuthorSourceSelector.tsx";
import { getAuthors } from "../controllers/mongo/author.controller.ts";
import { getSources } from "../controllers/mongo/source.controller.ts";
import Typography, { getTypographyClass } from "../components/Typography.tsx";
import { Head, Handlers, PageProps, AiOutlineSearch, ObjectId, asset } from "../deps.ts";
import { FullQuote, getFullQuotes, countQuotes } from "../controllers/mongo/quote.controller.ts";
import { WEBSITE_URL } from "../env.ts";

interface IndexProps {
  page: number;
  limit: number;
  pages: number[];
  hasMore: boolean;
  isAdmin: boolean;
  authors: Author[];
  sources: Source[];
  sourceId?: string;
  authorId?: string;
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

    if (queryParams.page && isNaN(+queryParams.page)) return redirect("/");

    const page = queryParams.page ? +queryParams.page : 1;
    if (!pages.includes(page)) return redirect(`/?page=${page <= 0 ? 1 : pages[pages.length - 1]}`);
    if (queryParams.page === "1") return redirect("/");

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

  async POST(req) {
    const form = await req.formData();

    const authorId = form.get("author")?.toString();
    const sourceId = form.get("source")?.toString();

    if (!authorId || !sourceId) return new Response("Missing author, or source", { status: 400 });

    const { headers } = await createSignedCookie("authorId", authorId, { httpOnly: true, path: "/" });
    const { cookie } = await createSignedCookie("sourceId", sourceId, { httpOnly: true, path: "/" });
    headers.append("Set-Cookie", cookie);

    return redirect(`/`, { body: JSON.stringify({ authorId, sourceId }), headers });
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  const { authorId = "all", sourceId = "all" } = data;
  const authors = [{ _id: "all", name: "All authors" }, ...data.authors];

  const authorsWithSourcesCount = data.authors.reduce((acc, author) => {
    const authorId = `${author._id}`;
    acc[authorId] = data.sources.filter((s) => s.authors.some((a) => `${a}` === authorId)).length;
    return acc;
  }, {} as Record<string, number>);

  const sources = [
    {
      _id: "all",
      name: "All sources",
      authors: [...data.authors.map((a) => `${a._id}`).filter((a) => authorsWithSourcesCount[a] >= 1), "all"],
    },
    ...data.sources,
  ];

  return (
    <>
      <Head>
        <Metas
          title="Objectivism quotes"
          image={`${WEBSITE_URL}${asset("/aynrand.png")}`}
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
