import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import { State } from "../types/state.type.ts";
import { isAdminPage } from "../utils/isAdminPage.tsx";
import { Middleware, MiddlewareHandlerContext, compare, cookieSession } from "../deps.ts";

const session = cookieSession({
  secure: true,
  httpOnly: true,
  sameSite: "Strict",
  maxAge: Number.MAX_SAFE_INTEGER,
});

export const { handler }: Middleware<State> = {
  handler: [
    // implement fresh-session
    (req, ctx) => session(req, ctx as unknown as MiddlewareHandlerContext<Record<string, unknown>>),

    // parse the session data
    (_, ctx) => {
      ctx.state.authorId = ctx.state.session.get("authorId");
      ctx.state.sourceId = ctx.state.session.get("sourceId");
      ctx.state.authToken = ctx.state.session.get("authToken");
      return ctx.next();
    },

    // check if the user is trying to access an admin page
    async (req, ctx) => {
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
        ctx.state.session.set("authToken", null);
        return response;
      }

      return ctx.next();
    },

    // add the Link: rel="modulepreload" header
    async (_, ctx) => {
      const response = await ctx.next();
      response.headers.append("Link", 'rel="modulepreload"');
      return response;
    },
  ],
};
