import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";
import verifySignedCookie from "../utils/verifySignedCookie.ts";
import { getCookies, MiddlewareHandlerContext, compare, deleteCookie } from "../deps.ts";

const adminURLs = ["/quote/new", "/source/new", "/quote/edit/:id", "/sources"].map(
  (pathname) => new URLPattern({ pathname })
);

export const handler = [
  async function (req: Request, ctx: MiddlewareHandlerContext<State>) {
    const invalidKeys: string[] = [];
    const cookies = getCookies(req.headers);

    for (const key of Object.keys(cookies) as (keyof State)[]) {
      const isValid = await verifySignedCookie(req.headers, key);
      if (isValid === false) {
        invalidKeys.push(key);
      } else {
        ctx.state[key] = isValid.split(".")[0];
      }
    }

    if (invalidKeys.length > 0) {
      const response = redirect("/signin");
      for (const key of invalidKeys) deleteCookie(response.headers, key);
      return response;
    }

    return ctx.next();
  },

  async function (req: Request, ctx: MiddlewareHandlerContext<State>) {
    const url = new URL(req.url);
    if (url.pathname === "") return await ctx.next();

    if (!ctx.state.authToken) {
      if (url.pathname === "/signin") return ctx.next();

      // redirect to signin page if the user is trying to access an admin page
      if (adminURLs.some((pattern) => pattern.test(req.url))) return redirect("/signin");

      return ctx.next();
    }

    // delete the token if it is not valid
    if (!(await compare(ctx.state.authToken, AUTH_TOKEN))) {
      const response = redirect("/signin");
      deleteCookie(response.headers, "authToken");
      return response;
    }

    return ctx.next();
  },
];
