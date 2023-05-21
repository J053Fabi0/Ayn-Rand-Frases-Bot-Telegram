import { State } from "../types/state.type.ts";
import { AUTH_TOKEN, BOT_TOKEN } from "../env.ts";
import { getCookies, MiddlewareHandlerContext, compare, deleteCookie, verifySignedCookie } from "../deps.ts";

const adminURLs = ["/quote/new", "/source/new"];

export async function handler(req: Request, ctx: MiddlewareHandlerContext<State>) {
  const url = new URL(req.url);
  if (url.pathname === "") return await ctx.next();

  const cookies = getCookies(req.headers);
  ctx.state.authToken = cookies.authToken;

  if (!ctx.state.authToken) {
    if (url.pathname === "/signin") return ctx.next();

    // redirect to signin page if the user is trying to access an admin page
    if (adminURLs.includes(url.pathname)) {
      const headers = new Headers();
      headers.set("location", "/signin");
      return new Response(null, { status: 303, headers });
    }

    return ctx.next();
  }

  const isAuthTokenValid = await verifySignedCookie(req.headers, "authToken", BOT_TOKEN);
  const authToken = isAuthTokenValid === false ? "" : isAuthTokenValid.split(".")[0];

  // delete the token if it is not valid
  if (isAuthTokenValid === false || !(await compare(authToken, AUTH_TOKEN))) {
    const headers = new Headers();
    headers.set("location", "/signin");
    deleteCookie(headers, "authToken");
    return new Response(null, { status: 303, headers });
  }

  return ctx.next();
}
