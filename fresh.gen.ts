// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_app.tsx";
import * as $1 from "./routes/_middleware.tsx";
import * as $2 from "./routes/author/new.tsx";
import * as $3 from "./routes/index.tsx";
import * as $4 from "./routes/quote/[id].tsx";
import * as $5 from "./routes/quote/new.tsx";
import * as $6 from "./routes/signin.tsx";
import * as $7 from "./routes/source/new.tsx";
import * as $$0 from "./islands/AuthorSourceSelector.tsx";

const manifest = {
  routes: {
    "./routes/_app.tsx": $0,
    "./routes/_middleware.tsx": $1,
    "./routes/author/new.tsx": $2,
    "./routes/index.tsx": $3,
    "./routes/quote/[id].tsx": $4,
    "./routes/quote/new.tsx": $5,
    "./routes/signin.tsx": $6,
    "./routes/source/new.tsx": $7,
  },
  islands: {
    "./islands/AuthorSourceSelector.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
