import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";
import { isAdminPage } from "../utils/isAdminPage.tsx";
import verifySignedCookie from "../utils/verifySignedCookie.ts";
import { getCookies, MiddlewareHandlerContext, compare, deleteCookie } from "../deps.ts";

export const handler = [
  // parse and check cookies
  async function (req: Request, ctx: MiddlewareHandlerContext<State>) {
    const invalidKeys: string[] = [];
    const cookies = getCookies(req.headers);

    for (const key of Object.keys(cookies) as (keyof State)[]) {
      if (key === "quoteExists") continue;

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

  // check if the user is trying to access an admin page
  async function (req: Request, ctx: MiddlewareHandlerContext<State>) {
    const url = new URL(req.url);
    if (url.pathname === "") return await ctx.next();

    if (!ctx.state.authToken) {
      if (url.pathname === "/signin") return ctx.next();

      // redirect to signin page if the user is trying to access an admin page
      if (isAdminPage(req.url)) return redirect("/signin");

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

  // add the Link: rel="modulepreload" header
  async function (req: Request, ctx: MiddlewareHandlerContext<State>) {
    const response = await ctx.next();
    response.headers.append("Link", 'rel="modulepreload"');
    return response;
  },
];
