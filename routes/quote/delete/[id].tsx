import redirect from "../../../utils/redirect.ts";
import { State } from "../../../types/state.type.ts";
import Typography from "../../../components/Typography.tsx";
import { Handlers, PageProps, Head } from "../../../deps.ts";
import Button, { getButtonClasses } from "../../../components/Button.tsx";
import { archiveQuote } from "../../../controllers/opine/quote.controller.ts";

interface DeleteQuoteProps {
  quoteNumber: number;
}

export const handler: Handlers<DeleteQuoteProps, State> = {
  async GET(_, ctx) {
    if (!ctx.state.quoteExists) return ctx.renderNotFound();

    const id = +ctx.params.id;

    return await ctx.render({ quoteNumber: id });
  },

  async POST(_, ctx) {
    if (!ctx.state.quoteExists) return ctx.renderNotFound();

    await archiveQuote(ctx.params.id);

    return redirect("/");
  },
};

export default function DeleteSource({ data: { quoteNumber } }: PageProps<DeleteQuoteProps>) {
  return (
    <>
      <Head>
        <title>Delete quote</title>
      </Head>

      <Typography variant="h2">
        Delete quote #<code>{quoteNumber}</code>
      </Typography>

      <Typography>
        This action <b>can</b> be undone; this will only archive the quote.
      </Typography>

      <div class="mt-9 flex justify-center align-center items-center mt-2 gap-8">
        <a href={`/quote/edit/${quoteNumber}`} class={getButtonClasses("blue")}>
          Go back
        </a>
        <form method="post">
          <Button class="py-2 px-4" type="submit" color="red">
            Yes, delete
          </Button>
        </form>
      </div>
    </>
  );
}
