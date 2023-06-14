import { Head, Handlers } from "../../deps.ts";
import redirect from "../../utils/redirect.ts";
import Button from "../../components/Button.tsx";
import Typography from "../../components/Typography.tsx";
import { createAuthor } from "../../controllers/mongo/author.controller.ts";

export const handler: Handlers = {
  async POST(req) {
    const form = await req.formData();

    const author = form.get("author")?.toString();

    if (!author) return new Response("Missing author", { status: 400 });

    await createAuthor({ name: author });

    // Redirect user to the quote page.
    return redirect("/quote/new");
  },
};

export default function NewAuthor() {
  return (
    <>
      <Head>
        <title>New author</title>
      </Head>

      <Typography variant="h4" class="text-2xl">
        Publish a new author
      </Typography>

      <form method="post">
        <div class="flex flex-col">
          <input
            required
            type="text"
            name="author"
            placeholder="Author"
            class="my-2 p-2 border border-gray-300 rounded w-full"
          />
        </div>

        <div class="mt-3 flex justify-center items-center">
          <Button class="mt-2 py-2 px-4 text-lg" type="submit" color="green">
            Publish
          </Button>
        </div>
      </form>
    </>
  );
}
