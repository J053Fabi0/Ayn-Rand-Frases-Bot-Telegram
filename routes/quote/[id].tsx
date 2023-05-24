import { State } from "../../types/state.type.ts";
import { Metas } from "../../components/Metas.tsx";
import Typography from "../../components/Typography.tsx";
import Quote from "../../types/collections/quote.type.ts";
import { Handlers, Head, PageProps, ObjectId } from "../../deps.ts";
import { PossibleQuote, getFullQuote } from "../../controllers/mongo/quote.controller.ts";

interface QuoteProps {
  fullQuote: string | null;
  quote: PossibleQuote | null;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    // The id can be either the quote number or the quote id
    const quote = await getFullQuote(!isNaN(parseInt(id)) ? { number: parseInt(id) } : { _id: new ObjectId(id) });

    return await ctx.render({ fullQuote: quote.fullQuote, quote: quote.possibleQuote });
  },
};

export default function Quote(props: PageProps<QuoteProps>) {
  const { fullQuote, quote } = props.data;

  if (!fullQuote || !quote) return <Typography variant="h4">Quote not found</Typography>;

  const splitQuote = fullQuote.split("\n");
  const description =
    quote.quote.replace(/\n/g, "").slice(0, 50) + (quote.quote.replace(/\n/g, "").length > 50 ? "..." : "");

  return (
    <>
      <Head>
        <Metas description={description} title={`Quote from ${quote.author[0]?.name}`} />
      </Head>
      <p>
        {splitQuote.map((t, i) => (
          <p class={`mt-2${i === splitQuote.length - 1 && /^ - /.test(t) ? " ml-2" : ""}`}>{t}</p>
        ))}
      </p>
    </>
  );
}
