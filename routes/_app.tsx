import { AppProps } from "../deps.ts";

export default function App({ Component }: AppProps) {
  return (
    <body class="min-h-screen flex flex-col">
      <div class="px-4 pt-8 mx-auto w-full max-w-screen-md flex-1">
        <Component />
      </div>

      <div class="py-8 bg-gray-300 text-white text-center flex justify-center items-center gap-2">
        <a href="https://fresh.deno.dev">
          <img width="197" height="37" src="https://fresh.deno.dev/fresh-badge-dark.svg" alt="Made with Fresh" />
        </a>
      </div>
    </body>
  );
}
