import { State } from "../types/state.type.ts";
import Typography from "../components/Typography.tsx";
import { Head, Handlers, PageProps } from "../deps.ts";

interface IndexProps {
  isAdmin: boolean;
}

export const handler: Handlers<IndexProps, State> = {
  async GET(_, ctx) {
    return await ctx.render({ isAdmin: Boolean(ctx.state.authToken) });
  },
};

export default function Home({ data }: PageProps<IndexProps>) {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

      {data.isAdmin ? (
        <>
          <a href="/quote/new">
            <p class="mt-3 underline">Publish a quote</p>
          </a>

          <a href="/source/new">
            <p class="mt-3 underline">Publish a source</p>
          </a>

          <a href="/source/new">
            <p class="mt-3 underline">Publish an author</p>
          </a>
        </>
      ) : (
        <>
          <Typography variant="h3">Work in progress</Typography>
          <Typography class="mt-3">
            In the meantime checkout the Telegram bot{" "}
            <a href="https://t.me/FrasesDeAynRandBot" class="mt-3 underline" target="_blank">
              @FrasesDeAynRandBot
            </a>
            .
          </Typography>

          <Typography class="mt-5">
            If you are an administrator,{" "}
            <a href="/signin" class="mt-3 underline">
              sign in here
            </a>
            .
          </Typography>
        </>
      )}
    </>
  );
}
