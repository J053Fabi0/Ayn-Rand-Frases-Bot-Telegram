import Metas from "../components/Metas.tsx";
import redirect from "../utils/redirect.ts";
import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import Pagination from "../components/Pagination.tsx";
import AdminTools from "../components/AdminTools.tsx";
import getQueryParams from "../utils/getQueryParams.ts";
import checkPageParam from "../utils/checkPageParam.ts";
import Author from "../types/collections/author.type.ts";
import Source from "../types/collections/source.type.ts";
import isResponse from "../types/typeGuards/isResponse.ts";
import { getAuthors } from "../controllers/mongo/author.controller.ts";
import Typography, { getTypographyClass } from "../components/Typography.tsx";
import { countSources, getSources } from "../controllers/mongo/source.controller.ts";
import { Head, Handlers, PageProps, AiOutlineSearch, ObjectId, Filter } from "../deps.ts";

interface IndexProps {
  page: number;
  limit: number;
  pages: number[];
  hasMore: boolean;
  authors: Author[];
  sources: Source[];
  authorId: string;
}

const limit = 12;

export const handler: Handlers<IndexProps, State> = {
  async GET(req, ctx) {
    const queryParams = getQueryParams(req.url) as { page?: string };

    const authorId = ctx.state.authorId || "all";

    const filter: Filter<Source> = {};
    if (authorId !== "all") filter.authors = new ObjectId(authorId);

    const sourceCount = await countSources(filter);
    const pages = Array.from({ length: Math.ceil(sourceCount / limit) }, (_, i) => i + 1);

    const page = checkPageParam("sources", queryParams, pages);
    if (isResponse(page)) return page;

    const sources = await getSources(filter, {
      limit,
      sort: { createdAt: -1 },
      skip: (page - 1) * limit,
      projection: { _id: 1, name: 1, authors: 1 },
    });

    return ctx.render({
      page,
      limit,
      pages,
      authorId,
      sources,
      hasMore: sourceCount > page * limit,
      authors: await getAuthors({}, { projection: { _id: 1, name: 1 } }),
    });
  },

  async POST(req, ctx) {
    const form = await req.formData();
    const authorId = form.get("author")?.toString();
    if (!authorId) return new Response("Missing author", { status: 400 });
    ctx.state.session.set("authorId", authorId);
    return redirect(`/sources`);
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  const authors = [{ _id: "all", name: "All authors" }, ...data.authors];

  return (
    <>
      <Head>
        <Metas title="Objectivism quotes" description="" />
      </Head>

      <form method="post" class="flex gap-3 w-full mb-3">
        <div class="flex flex-col md:flex-row gap-3 w-full">
          <select required name="author" value={data.authorId} class="p-2 border border-gray-300 rounded w-full">
            {authors.map((author) => (
              <option value={`${author._id}`}>{author.name}</option>
            ))}
          </select>
        </div>

        <Button color="green" type="submit">
          <AiOutlineSearch size={20} />
        </Button>
      </form>

      <ul class="list-disc list-inside">
        {data.sources.map((source) => (
          <>
            <li class={`mt-2 ${getTypographyClass()}`}>
              <a href={`/source/edit/${source._id}`} class="hover:underline hover:text-blue-600">
                {source.name}
              </a>
            </li>

            {/* Authors */}
            {source.authors.length >= 1 && (
              <form method="post" class="ml-5">
                {source.authors
                  .map((authorId) => authors.find((a) => `${a._id}` === `${authorId}`) as Author)
                  .filter(Boolean)
                  .map((author, i, { length }) => (
                    <button type="submit" name="author" value={`${author._id}`}>
                      <Typography variant="smallP" class="ml-1 hover:underline hover:text-blue-600">
                        {author.name}
                        {i === length - 1 ? "" : ","}
                      </Typography>
                    </button>
                  ))}
              </form>
            )}
          </>
        ))}
      </ul>

      <div class="flex justify-center mt-5">
        <Pagination pages={data.pages} baseUrl="/sources?page=" currentPage={data.page} maxPages={7} />
      </div>

      <hr class="my-4" />
      <AdminTools />
    </>
  );
}
