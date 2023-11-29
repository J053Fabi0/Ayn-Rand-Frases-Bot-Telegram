/// <reference lib="dom" />
/// <reference lib="deno.ns" />
/// <reference lib="dom.iterable" />
/// <reference lib="deno.unstable" />
/// <reference no-default-lib="true" />
/// <reference lib="dom.asynciterable" />

// load the .env file
import "./utils/crons.ts";
import { start } from "./deps.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

// Then start the bot
import("./initBot.ts");

// Start the web server
await start(manifest, config);
