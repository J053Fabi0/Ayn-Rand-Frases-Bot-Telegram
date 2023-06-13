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
import CommonResponse from "./types/commonResponse.type.ts";
import CommonRequestPartial from "./types/commonRequest.type.ts";
import { opine, opineCors, json, NextFunction, start, twindPlugin } from "./deps.ts";

// Then start the bot
import("./initBot.ts");

// Create the web server app
const app = opine();
app.use(json());
app.use(opineCors());

// Use the router
app.use("/", router);

// Error handling
app.use((err: Error, _: CommonRequestPartial, res: CommonResponse, __: NextFunction) => handleError(res, err));

app.listen(API_PORT, () => console.log(`Listening on http://localhost:${API_PORT}/`));

// Run the diffuser
diffuse();

// Start the web server
await start(manifest, { plugins: [twindPlugin(twindConfig)], port: WEB_PORT });
