import { Head } from "../deps.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

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
  );
}
