import { Head } from "../deps.ts";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div class="p-4 mx-auto max-w-screen-md">
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </div>
    </>
  );
}
