import { AppProps, Head } from "../deps.ts";
import Navbar from "../components/Navbar.tsx";
import { Links } from "../components/Links.tsx";

export default function App({ Component }: AppProps) {
  return (
    <>
      <Head>
        <Links />
      </Head>

      <body class="min-h-screen flex flex-col">
        <Navbar />

        <div class="px-4 pt-8 mx-auto w-full max-w-screen-lg flex-1">
          <Component />
        </div>

        <div class="mt-6 py-5 bg-gray-300 text-white">
          <div class="px-4 mx-auto w-full max-w-screen-lg flex justify-center items-center gap-2">
            <a href="https://fresh.deno.dev">
              <img
                width="197"
                height="37"
                src="https://fresh.deno.dev/fresh-badge-dark.svg"
                alt="Made with Fresh"
              />
            </a>
          </div>
        </div>
      </body>
    </>
  );
}
