import Button from "../../components/Button.tsx";
import isMongoId from "../../utils/isMongoId.ts";
import { State } from "../../types/state.type.ts";
import { Metas } from "../../components/Metas.tsx";
import Typography from "../../components/Typography.tsx";
import Quote from "../../types/collections/quote.type.ts";
import { FullQuote, getFullQuote, getFullQuotes } from "../../controllers/mongo/quote.controller.ts";
import { Handlers, Head, PageProps, ObjectId, BsCaretLeftFill, BsCaretRightFill, AiFillEdit } from "../../deps.ts";

interface QuoteProps {
  quoteObj: FullQuote | null;
  next: number;
  previous: number;
  isAdmin: boolean;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;
    const isAdmin = Boolean(ctx.state.authToken);

    // The id can be either the quote number or the quote id
    const possibleQuote = await getFullQuote(isMongoId(id) ? { _id: new ObjectId(id) } : { number: parseInt(id) });

    if (possibleQuote) {
      const fullQuotes = (await getFullQuotes(undefined, { projection: { number: 1 } })).map((q) => q.number);
      const index = fullQuotes.indexOf(possibleQuote.number);
      const next = index > 0 ? fullQuotes[index - 1] : fullQuotes[fullQuotes.length - 1];
      const previous = index < fullQuotes.length - 1 ? fullQuotes[index + 1] : fullQuotes[0];

      return await ctx.render({ quoteObj: possibleQuote, next, previous, isAdmin });
    }

    return await ctx.render({ quoteObj: possibleQuote, next: 1, previous: 1, isAdmin });
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

      <div class="flex justify-center mt-9">
        <a href={`/quote/${previous}`} alt={`Quote #${previous}`}>
          <Button class="mr-3 flex items-center" color="green">
            <BsCaretLeftFill size={16} /> #{previous}
          </Button>
        </a>

        {isAdmin && (
          <a href={`/quote/edit/${quoteObj.number}`} alt={`Quote #${next}`}>
            <Button color="blue" class="flex items-center mr-3">
              <AiFillEdit size={16} />
            </Button>
          </a>
        )}

        <a href={`/quote/${next}`} alt={`Quote #${next}`}>
          <Button color="green" class="flex items-center">
            #{next} <BsCaretRightFill size={16} />
          </Button>
        </a>
      </div>
    </>
  );
}
