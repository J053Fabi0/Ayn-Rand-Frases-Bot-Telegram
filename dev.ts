#!/usr/bin/env -S deno run --watch --allow-sys --allow-net --allow-read --allow-env --allow-run --allow-write

import { dev } from "./deps.ts";

await dev(import.meta.url, "./index.ts");
