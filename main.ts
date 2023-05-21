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
import router from "./router/router.ts";
import diffuse from "./utils/diffuse.ts";
import twindConfig from "./twind.config.ts";
import { API_PORT, WEB_PORT } from "./env.ts";
import handleError from "./utils/handleError.ts";
import CommonRequest from "./types/commonRequest.type.ts";
import CommonResponse from "./types/commonResponse.type.ts";
import { opine, opineCors, json, NextFunction, start, twindPlugin } from "./deps.ts";

// Check that all required .env variables are set
const envVariables = ["ADMINS_IDS", "BOT_TOKEN", "API_PORT", "WEB_PORT", "MONGO_URI", "AUTH_TOKEN"];
for (const envVariable of envVariables)
  if (Deno.env.get(envVariable) === undefined) console.log(envVariable + " not set in .env."), Deno.exit(0);

// Then start the bot
import("./initBot.ts");

// Create the web server app
const app = opine();
app.use(json());
app.use(opineCors());

// Use the router
app.use("/", router);

// Error handling
app.use((err: Error, _: CommonRequest, res: CommonResponse, __: NextFunction) => handleError(res, err));

app.listen(API_PORT, () => console.log(`Listening on http://localhost:${API_PORT}/`));

// Run the diffuser
diffuse();

// Start the web server
await start(manifest, { plugins: [twindPlugin(twindConfig)], port: WEB_PORT });
