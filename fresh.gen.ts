// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_500.tsx";
import * as $2 from "./routes/_app.tsx";
import * as $3 from "./routes/_middleware.tsx";
import * as $4 from "./routes/author/new.tsx";
import * as $5 from "./routes/index.tsx";
import * as $6 from "./routes/quote/[id].tsx";
import * as $7 from "./routes/quote/new.tsx";
import * as $8 from "./routes/signin.tsx";
import * as $9 from "./routes/signout.tsx";
import * as $10 from "./routes/source/new.tsx";
import * as $$0 from "./islands/AuthorSourceSelector.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_500.tsx": $1,
    "./routes/_app.tsx": $2,
    "./routes/_middleware.tsx": $3,
    "./routes/author/new.tsx": $4,
    "./routes/index.tsx": $5,
    "./routes/quote/[id].tsx": $6,
    "./routes/quote/new.tsx": $7,
    "./routes/signin.tsx": $8,
    "./routes/signout.tsx": $9,
    "./routes/source/new.tsx": $10,
  },
  islands: {
    "./islands/AuthorSourceSelector.tsx": $$0,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
