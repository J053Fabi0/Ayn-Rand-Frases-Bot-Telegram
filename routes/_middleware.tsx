import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";
import { isAdminPage } from "../utils/isAdminPage.tsx";
import { MiddlewareHandlerContext, compare, deleteCookie, cookieSession } from "../deps.ts";

const session = cookieSession({});

export const handler = [
  // implement fresh-session
  (req: Request, ctx: MiddlewareHandlerContext<State>) => session(req, ctx),

  // parse the session data
  function (_: Request, ctx: MiddlewareHandlerContext<State>) {
    ctx.state.authToken = ctx.state.session.get("authToken");
    ctx.state.authorId = ctx.state.session.get("authorId");
    ctx.state.sourceId = ctx.state.session.get("sourceId");
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
