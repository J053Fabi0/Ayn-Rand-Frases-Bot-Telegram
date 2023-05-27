import { BsCaretLeftFill, BsCaretRightFill } from "../deps.ts";

const classes = {
  active:
    "mx-1 flex h-9 w-9 items-center justify-center rounded-full bg-pink-500 p-0 text-sm text-white shadow-md transition duration-150 ease-in-out",
  inactive:
    "mx-1 flex h-9 w-9 items-center justify-center rounded-full border border-blue-gray-100 bg-transparent p-0 text-sm text-blue-gray-500 transition duration-150 ease-in-out hover:bg-light-300",
};

interface PaginationProps {
  /**
   * baseUrl + currentPage = href
   */
  baseUrl: string;
  pages: (number | string)[];
  currentPage: number | string;
  maxPages?: number;
}

export default function Pagination({ baseUrl, pages, currentPage, maxPages = 5 }: PaginationProps) {
  maxPages = Math.max(maxPages % 2 === 0 ? maxPages - 1 : maxPages, 1);

  const indexOfCurrentPage = pages.indexOf(currentPage);

  const pagesForEachSide = Math.floor(maxPages / 2);

  const pagesToTheLeft = pages.slice(Math.max(indexOfCurrentPage - pagesForEachSide, 0), indexOfCurrentPage);
  const pagesToTheRight = pages.slice(indexOfCurrentPage + 1, indexOfCurrentPage + pagesForEachSide + 1);

  if (pagesToTheLeft.length < pagesForEachSide)
    pagesToTheRight.push(
      ...pages
        .slice(
          indexOfCurrentPage + pagesForEachSide + 1,
          indexOfCurrentPage + pagesForEachSide + 1 + pagesForEachSide - pagesToTheLeft.length
        )
        .filter((p) => p !== undefined)
    );

  if (pagesToTheRight.length < pagesForEachSide)
    pagesToTheLeft.unshift(
      ...pages
        .slice(
          Math.max(indexOfCurrentPage - pagesForEachSide - pagesForEachSide + pagesToTheRight.length, 0),
          indexOfCurrentPage - pagesForEachSide
        )
        .filter((p) => p !== undefined)
    );

  return (
    <nav>
      <ul class="flex">
        {/* Previous button */}
        {pagesToTheLeft.length > 0 && (
          <li>
            <a
              aria-label="Previous"
              class={classes.inactive}
              href={`${baseUrl}${pagesToTheLeft[pagesToTheLeft.length - 1]}`}
            >
              <BsCaretLeftFill size={16} />
            </a>
          </li>
        )}

        {/* Pages to the left */}
        {pagesToTheLeft.map((page) => (
          <li>
            <a class={classes.inactive} href={`${baseUrl}${page}`}>
              {page}
            </a>
          </li>
        ))}

        {/* Current page */}
        <li>
          <span class={`${classes.active} select-none`}>{currentPage}</span>
        </li>

        {/* Pages to the right */}
        {pagesToTheRight.map((page) => (
          <li>
            <a class={classes.inactive} href={`${baseUrl}${page}`}>
              {page}
            </a>
          </li>
        ))}

        {/* Next button */}
        {pagesToTheRight.length > 0 && (
          <li>
            <a aria-label="Next" class={classes.inactive} href={`${baseUrl}${pagesToTheRight[0]}`}>
              <BsCaretRightFill size={16} />
            </a>
          </li>
        )}
      </ul>
    </nav>
  );
}
