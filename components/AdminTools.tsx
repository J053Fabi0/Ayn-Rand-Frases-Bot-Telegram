import Button from "./Button.tsx";
import Typography from "./Typography.tsx";

const AdminTools = () => (
  <>
    <Typography variant="h4" class="mb-2">
      New
    </Typography>

    <div class="flex flex-row flex-grap gap-2">
      <a href="/quote/new">
        <Button color="green">Quote</Button>
      </a>

      <a href="/source/new">
        <Button color="blue">Source</Button>
      </a>

      <a href="/author/new">
        <Button color="red">Author</Button>
      </a>
    </div>

    <hr class="my-4" />

    <Typography variant="h4" class="mb-2">
      View / Edit / Delete
    </Typography>

    <div class="flex flex-row flex-grap gap-2">
      <a href="/sources">
        <Button color="blue">Sources</Button>
      </a>

      {/* <a href="/authors">
        <Button color="red">Authors</Button>
      </a> */}
    </div>
  </>
);

export default AdminTools;
