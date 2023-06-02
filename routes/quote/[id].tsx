import Metas from "../../components/Metas.tsx";
import Button from "../../components/Button.tsx";
import { State } from "../../types/state.type.ts";
import Typography from "../../components/Typography.tsx";
import Quote from "../../types/collections/quote.type.ts";
import LastSentTime from "../../islands/LastSentTime.tsx";
import { Handlers, Head, PageProps } from "../../deps.ts";
import { FiTrash2, BsCaretLeftFill, BsCaretRightFill, AiFillEdit } from "../../deps.ts";
import { FullQuote, getFullQuote, getFullQuotes } from "../../controllers/mongo/quote.controller.ts";

interface QuoteProps {
  next: number;
  previous: number;
  isAdmin: boolean;
  quoteObj: FullQuote;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const isAdmin = Boolean(ctx.state.authToken);

    if (!ctx.state.quoteExists) return ctx.renderNotFound();

    const possibleQuote = (await getFullQuote({ number: parseInt(id) })) as FullQuote;

    const fullQuotes = (await getFullQuotes(undefined, { projection: { number: 1 } })).map((q) => q.number);
    const index = fullQuotes.indexOf(possibleQuote.number);
    const next = index > 0 ? fullQuotes[index - 1] : fullQuotes[fullQuotes.length - 1];
    const previous = index < fullQuotes.length - 1 ? fullQuotes[index + 1] : fullQuotes[0];

    return await ctx.render({ quoteObj: possibleQuote, next, previous, isAdmin });
  },
};

export default function Quote({ data }: PageProps<QuoteProps>) {
  const { quoteObj, next, previous, isAdmin } = data;

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
