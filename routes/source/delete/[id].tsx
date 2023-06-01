import redirect from "../../../utils/redirect.ts";
import { State } from "../../../types/state.type.ts";
import Typography from "../../../components/Typography.tsx";
import Source from "../../../types/collections/source.type.ts";
import isMongoId from "../../../types/typeGuards/isMongoId.ts";
import { Handlers, PageProps, ObjectId, Head } from "../../../deps.ts";
import Button, { getButtonClasses } from "../../../components/Button.tsx";
import { getSource } from "../../../controllers/mongo/source.controller.ts";
import { deleteSource } from "../../../controllers/opine/source.controller.ts";

interface DeleteSourceProps {
  source: Source;
}

export const handler: Handlers<DeleteSourceProps, State> = {
  async GET(_, ctx) {
    const { id } = ctx.params;

    if (!isMongoId(id)) throw new Error(`Invalid id format: ${id}`);

    const possibleSource = await getSource({ _id: new ObjectId(id) });
    if (!possibleSource) throw new Error(`Source not found: ${id}`);

    return await ctx.render({ source: possibleSource });
  },

  async POST(req, ctx) {
    const { id } = ctx.params;

    if (!isMongoId(id)) throw new Error(`Invalid id format: ${id}`);

    const deleteCount = await deleteSource({ params: { _id: id } });
    if (deleteCount === 0) throw new Error(`Source not found: ${id}`);

    return redirect("/sources");
  },
};

export default function DeleteSource({ data: { source } }: PageProps<DeleteSourceProps>) {
  return (
    <>
      <Head>
        <title>Delete source</title>
      </Head>

      <Typography variant="h2">
        Delete source <code>{source.name}</code>
      </Typography>

      <Typography>
        This action cannot be undone. All quotes associated with this source will be left with no source.
      </Typography>

      <div class="mt-9 flex justify-center align-center items-center mt-2 gap-8">
        <a href={`/source/edit/${source._id}`} class={getButtonClasses("blue")}>
          Go back
        </a>
        <form method="post">
          <Button class="py-2 px-4" type="submit" color="red">
            Yes, delete
          </Button>
        </form>
      </div>
    </>
  );
}
