import { AUTH_TOKEN } from "../env.ts";
import redirect from "../utils/redirect.ts";
import Button from "../components/Button.tsx";
import { Head, Handlers, compare } from "../deps.ts";
import Typography from "../components/Typography.tsx";
import createSignedCookie from "../utils/createSignedCookie.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

    const authToken = form.get("authToken")?.toString();
    if (!authToken) return new Response("Missing auth token", { status: 401 });
    if (!(await compare(authToken, AUTH_TOKEN))) return new Response("Unauthorized", { status: 401 });

    const { headers } = await createSignedCookie("authToken", authToken, { httpOnly: true, path: "/" });
    return redirect("/", { headers });
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
