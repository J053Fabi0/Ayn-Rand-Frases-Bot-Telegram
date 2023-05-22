import Button from "./Button.tsx";
import Header from "./Headers.tsx";

interface Page {
  href: string;
  name: string;
}

const pages: Page[] = [
  {
    href: "/quote/new",
    name: "New quote",
  },
  {
    href: "/source/new",
    name: "New source",
  },
];

export default function Navbar() {
  return (
    <nav class="bg-gray-300">
      <div class="mx-auto block w-full max-w-screen-xl py-2 px-4 lg:px-8 lg:py-4">
        <div class="container mx-auto flex items-center justify-between text-gray-900">
          <a
            href="/"
            class="mr-4 block cursor-pointer py-1.5 font-sans text-sm font-normal leading-normal text-inherit antialiased"
          >
            <Header size={5}>
              <span>Objectivism quotes</span>
            </Header>
          </a>
          <ul class="hidden items-center gap-6 lg:flex">
            {pages.map((page) => (
              <li class="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
                <a class="flex items-center" href={page.href}>
                  {page.name}
                </a>
              </li>
            ))}
          </ul>

          <a href="/signin">
            <Button color="blue" class="hidden lg:inline-block">
              <span>Sign in</span>
            </Button>
          </a>

          <button
            class="middle none relative ml-auto h-6 max-h-[40px] w-6 max-w-[40px] rounded-lg text-center font-sans text-xs font-medium uppercase text-blue-gray-500 transition-all hover:bg-transparent focus:bg-transparent active:bg-transparent disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none lg:hidden"
            data-collapse-target="navbar"
          >
            <span class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </span>
          </button>
        </div>

        <div
          class="block h-0 w-full basis-full overflow-hidden text-blue-gray-900 transition-all duration-300 ease-in lg:hidden"
          data-collapse="navbar"
        >
          <div class="container mx-auto pb-2">
            <ul class="mt-2 mb-4 flex flex-col gap-2">
              {pages.map((page) => (
                <li class="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
                  <a class="flex items-center" href={page.href}>
                    {page.name}
                  </a>
                </li>
              ))}
            </ul>

            <a href="/signin">
              <Button color="blue">
                <span>Sign in</span>
              </Button>
            </a>
          </div>
        </div>
      </div>

      <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/collapse.js"></script>
    </nav>
  );
}
