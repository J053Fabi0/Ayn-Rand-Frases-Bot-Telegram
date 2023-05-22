import Button from "../components/Button.tsx";
import Header from "../components/Headers.tsx";
import { AUTH_TOKEN, BOT_TOKEN } from "../env.ts";
import { Head, Handlers, compare, createSignedCookie } from "../deps.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

    const authToken = form.get("authToken")?.toString();
    if (!authToken) return new Response("Missing auth token", { status: 401 });
    if (!(await compare(authToken, AUTH_TOKEN))) return new Response("Unauthorized", { status: 401 });

    const { headers } = await createSignedCookie("authToken", authToken, BOT_TOKEN, { httpOnly: true, path: "/" });
    headers.set("location", "/");

    return new Response(null, { status: 303, headers });
  },
};

export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <Header size={4} class="text-2xl">
        Sign in as an admin
      </Header>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
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
