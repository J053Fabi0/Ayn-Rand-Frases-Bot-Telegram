import redirect from "./redirect.ts";

export default function checkPageParam(baseUrl: string, queryParams: { page?: string }, pages: number[]) {
  // If the page is not a number, remove it from the query params
  if (queryParams.page && isNaN(+queryParams.page)) return redirect(`/${baseUrl}`);

  const page = queryParams.page ? +queryParams.page : 1;

  // If the page is 1 or less, remove it from the query params, as 1 it is the default and 0 or less is not valid
  if (queryParams.page && page <= 1) return redirect(`/${baseUrl}`);

  // If the page is not present in the pages array, redirect to the greatest page
  if (!pages.includes(page)) return redirect(`/${baseUrl}?page=${pages[pages.length - 1]}`);

  return page;
}
