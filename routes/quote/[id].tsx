import { State } from "../../types/state.type.ts";
import { Handlers, PageProps, ObjectId } from "../../deps.ts";
import Quote from "../../types/collections/quote.type.ts";
import { getFullQuote } from "../../controllers/mongo/quote.controller.ts";
import Typography from "../../components/Typography.tsx";

interface QuoteProps {
  quote: string | null;
}

export const handler: Handlers<QuoteProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    // The id can be either the quote number or the quote id
    const quote = await getFullQuote(!isNaN(parseInt(id)) ? { number: parseInt(id) } : { _id: new ObjectId(id) });

    return await ctx.render({ quote: quote.fullQuote });
  },
};

export default function Quote(props: PageProps<QuoteProps>) {
  const { quote } = props.data;

  if (!quote) return <Typography variant="h4">Quote not found</Typography>;

  const splitQuote = quote.split("\n");

  return (
    <p>
      {splitQuote.map((t, i) => (
        <p class={`mt-2${i === splitQuote.length - 1 && /^ - /.test(t) ? " ml-2" : ""}`}>{t}</p>
      ))}
    </p>
  );
}
