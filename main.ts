/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="dom.iterable" />
/// <reference lib="deno.unstable" />
/// <reference no-default-lib="true" />
/// <reference lib="dom.asynciterable" />

// load the .env file
import "dotenv";
import "./utils/crons.ts";
import manifest from "./fresh.gen.ts";
import twindConfig from "./twind.config.ts";
import { start, twindPlugin } from "./deps.ts";

// Then start the bot
import("./initBot.ts");

// Start the web server
await start(manifest, { plugins: [twindPlugin(twindConfig)] });
