import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import Button from "../components/Button.tsx";
import { State } from "../types/state.type.ts";
import { Head, Handlers, compare } from "../deps.ts";
import Typography from "../components/Typography.tsx";

export const handler: Handlers<null, State> = {
  GET(_, ctx) {
    if (ctx.state.authToken) return redirect("/");
    return ctx.render();
  },

  async POST(req, ctx) {
    const form = await req.formData();

    const authToken = form.get("authToken")?.toString();
    if (!authToken) return new Response("Missing auth token", { status: 401 });
    if (!(await compare(authToken, AUTH_TOKEN))) return new Response("Unauthorized", { status: 401 });

    ctx.state.session.set("authToken", authToken);

    return redirect("/");
  },
};

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Typography variant="h4" class="text-2xl">
        Sign in as an administrator
      </Typography>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
            autoFocus
            type="password"
            name="authToken"
            placeholder="Auth token"
            class="mt-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 p-2" type="submit" color="blue">
            Sign in
          </Button>
        </div>
      </form>
    </>
  );
}
