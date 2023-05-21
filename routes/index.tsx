import { Head } from "../deps.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

      <h1 class="text-2xl">Objectivism quotes</h1>

      <p class="mt-3 underline">
        <a href="/quote/new">Publish a quote</a>
      </p>

      <p class="mt-3 underline">
        <a href="/source/new">Publish a source</a>
      </p>
    </>
  );
}
