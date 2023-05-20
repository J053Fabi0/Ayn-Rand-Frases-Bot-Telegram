import { Head } from "../deps.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

      <div class="py-5 mx-auto max-w-screen-md">
        <div class="min-h-screen">
          <h1 class="text-2xl">Objectivism quotes</h1>

          <p class="mt-3 underline">
            <a href="/quote/new">Publish a quote</a>
          </p>
        </div>

        {/* "Made with Fresh" logo */}
        <hr class="mb-4" />
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </div>
    </>
  );
}
