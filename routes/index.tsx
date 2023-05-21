import { Head } from "../deps.ts";
import { Container } from "../components/Container.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>Ayn Rand</title>
      </Head>

      <Container>
        <div class="min-h-screen">
          <h1 class="text-2xl">Objectivism quotes</h1>

          <p class="mt-3 underline">
            <a href="/quote/new">Publish a quote</a>
          </p>

          <p class="mt-3 underline">
            <a href="/source/new">Publish a source</a>
          </p>
        </div>

        {/* "Made with Fresh" logo */}
        <hr class="mb-4" />
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </Container>
    </>
  );
}
