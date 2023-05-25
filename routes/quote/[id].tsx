import { State } from "../../types/state.type.ts";
import { Metas } from "../../components/Metas.tsx";
import Typography from "../../components/Typography.tsx";
import Quote from "../../types/collections/quote.type.ts";
import { Handlers, Head, PageProps, ObjectId } from "../../deps.ts";
import { PossibleQuote, getFullQuote } from "../../controllers/mongo/quote.controller.ts";
import isMongoId from "../../utils/isMongoId.ts";

interface QuoteProps {
  quoteObj: PossibleQuote | null;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    // The id can be either the quote number or the quote id
    const { possibleQuote } = await getFullQuote(
      isMongoId(id) ? { _id: new ObjectId(id) } : { number: parseInt(id) }
    );

    return await ctx.render({ quoteObj: possibleQuote });
  },
};

export default function Quote(props: PageProps<QuoteProps>) {
  const { quoteObj } = props.data;

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
  const author = quoteObj.author[0]?.name || "Unknown";
  const source = quoteObj.source[0]?.name || "";
  const quote = quoteObj.quote.replace(/\n/g, " ");

  const description = quote.slice(0, 50) + (quote.length > 50 ? "…" : "");

  return (
    <>
      <Head>
        <Metas description={description} title={`Quote from ${author}`} />
      </Head>
      <p>
        {splitQuote.map((t, i) => (
          <p class={i > 0 ? "mt-2" : ""}>{t}</p>
        ))}
        <p class="mt-4 ml-2 font-semibold">
          - {author}. <i>{source}</i>.
        </p>
      </p>
    </>
  );
}
