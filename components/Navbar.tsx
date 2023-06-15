import Button from "./Button.tsx";
import Typography from "./Typography.tsx";

interface Page {
  href: string;
  name: string;
}

const pages: Page[] = [];

export default function Navbar({ loggedIn = false }) {
  const signInOrOut = loggedIn ? (
    <a href="/signout">
      <Button color="red">
        <span>Sign out</span>
      </Button>
    </a>
  ) : (
    <a href="/signin">
      <Button color="green">
        <span>Sign in</span>
      </Button>
    </a>
  );

  const pagesElement = pages.length > 0 && (
    <ul class="hidden items-center gap-6 lg:flex">
      {pages.map((page) => (
        <li class="block p-1 font-sans text-sm font-normal leading-normal text-inherit antialiased">
          <a class="flex items-center" href={page.href}>
            {page.name}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <nav class="bg-gray-300">
      <div class="mx-auto block w-full max-w-screen-lg py-2 px-4 lg:py-3">
        <div class="container mx-auto flex items-center justify-between text-gray-900">
          <a href="/">
            <Typography variant="h5" class="mr-4 cursor-pointer">
              Objectivism quotes
            </Typography>
          </a>

          {pagesElement}

          <div class="hidden lg:inline-block">{signInOrOut}</div>

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
          <div class="container mx-auto pb-2 pt-5">
            {pagesElement}
            {signInOrOut}
          </div>
        </div>
      </div>

      <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/collapse.js"></script>
    </nav>
  );
}
