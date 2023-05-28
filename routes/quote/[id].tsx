import redirect from "../../utils/redirect.ts";
import Button from "../../components/Button.tsx";
import isMongoId from "../../utils/isMongoId.ts";
import { State } from "../../types/state.type.ts";
import { Metas } from "../../components/Metas.tsx";
import Typography from "../../components/Typography.tsx";
import Quote from "../../types/collections/quote.type.ts";
import LastSentTime from "../../islands/LastSentTime.tsx";
import { Handlers, Head, PageProps, ObjectId } from "../../deps.ts";
import { deleteQuote } from "../../controllers/opine/quote.controller.ts";
import { FiTrash2, BsCaretLeftFill, BsCaretRightFill, AiFillEdit } from "../../deps.ts";
import { FullQuote, getFullQuote, getFullQuotes, getQuote } from "../../controllers/mongo/quote.controller.ts";

interface QuoteProps {
  quoteObj: FullQuote | null;
  next: number;
  previous: number;
  isAdmin: boolean;
}

const urlPattern = new URLPattern({ pathname: "/quote/:id" });

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const isAdmin = Boolean(ctx.state.authToken);

    const usingMongoId = isMongoId(id);

    // The id can be either the quote number or the quote id
    const possibleQuote = await getFullQuote(usingMongoId ? { _id: new ObjectId(id) } : { number: parseInt(id) });

    if (possibleQuote) {
      // If using the quote id, redirect to the quote number
      if (usingMongoId) return redirect(`/quote/${possibleQuote.number}`);

      const fullQuotes = (await getFullQuotes(undefined, { projection: { number: 1 } })).map((q) => q.number);
      const index = fullQuotes.indexOf(possibleQuote.number);
      const next = index > 0 ? fullQuotes[index - 1] : fullQuotes[fullQuotes.length - 1];
      const previous = index < fullQuotes.length - 1 ? fullQuotes[index + 1] : fullQuotes[0];

      return await ctx.render({ quoteObj: possibleQuote, next, previous, isAdmin });
    }

    return await ctx.render({ quoteObj: possibleQuote, next: 1, previous: 1, isAdmin });
  },

  async POST(req, ctx) {
    const groups = urlPattern.exec(req.url)!.pathname.groups as { id: string };

    const _id = isMongoId(groups.id)
      ? new ObjectId(groups.id)
      : (await getQuote({ number: parseInt(groups.id) }, { projection: { _id: 1 } }))?._id;

    if (!_id) return ctx.renderNotFound();

    const deleteCount = await deleteQuote({ params: { _id: `${_id}` } });

    if (deleteCount === 0) return ctx.renderNotFound();

    return redirect("/");
  },
};

export default function Quote({ data }: PageProps<QuoteProps>) {
  const { quoteObj, next, previous, isAdmin } = data;

  if (!quoteObj)
    return (
      <>
        <Head>
          <Metas description="" title="Quote not found" />
        </Head>
        <Typography variant="h4">Quote not found</Typography>{" "}
      </>
    );

  const splitQuote = quoteObj.quote.split("\n");
  const author = quoteObj.author?.name || "Unknown";
  const source = quoteObj.source?.name || "";
  const quote = quoteObj.quote.replace(/\n/g, " ");

  const description = quote.slice(0, 50) + (quote.length > 50 ? "…" : "");

  return (
    <>
      <Head>
        <Metas description={description} title={`Quote from ${author}`} />
      </Head>

      {/* Quote */}
      <div class="flex justify-center">
        <div class="max-w-screen-sm">
          {/* Quote */}
          {splitQuote.map((t, i) => (
            <Typography class={i > 0 ? "mt-2" : ""}>{t}</Typography>
          ))}

          {/* Author and source */}
          <Typography variant="lead" class="mt-4 ml-2">
            - {author}.
            {source && (
              <>
                {" "}
                <i>{source}</i>.
              </>
            )}
          </Typography>
        </div>
      </div>

      {/* Buttons */}
      <div class="flex justify-center mt-9">
        {/* Previous */}
        <a href={`/quote/${previous}`} alt={`Quote #${previous}`}>
          <Button class="mr-3 flex items-center" color="green">
            <BsCaretLeftFill size={16} /> #{previous}
          </Button>
        </a>

        {/* Edit and delete */}
        {isAdmin && (
          <>
            <a href={`/quote/edit/${quoteObj.number}`} alt={`Quote #${next}`}>
              <Button color="blue" class="mr-3">
                <AiFillEdit size={16} />
              </Button>
            </a>
            <form method="post">
              <Button class="mr-3" type="submit" color="red">
                <FiTrash2 size={16} />
              </Button>
            </form>
          </>
        )}

        {/* Next */}
        <a href={`/quote/${next}`} alt={`Quote #${next}`}>
          <Button color="green" class="flex items-center">
            #{next} <BsCaretRightFill size={16} />
          </Button>
        </a>
      </div>

      {/* Sent time */}
      <div class="flex justify-center">
        <div class="max-w-screen-sm w-full">
          <hr class="my-5" />

          <Typography variant="h6">
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
