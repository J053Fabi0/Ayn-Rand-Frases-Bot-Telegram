/**
 * Returns an object with the query params of the url.
 * @param url It must be a full url.
 */
const getQueryParams = (url: string) =>
  Object.fromEntries([...new URLSearchParams(url.split("?")[1] || "").entries()]);
export default getQueryParams;
