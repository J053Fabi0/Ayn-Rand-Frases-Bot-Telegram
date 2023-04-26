// load the .env file
import "dotenv";
import router from "./routes/routes.ts";
import handleError from "./utils/handleError.ts";
import CommonRequest from "./types/commonRequest.type.ts";
import CommonResponse from "./types/commonResponse.type.ts";
import { opine, opineCors, json, NextFunction } from "./deps.ts";

// Check that all required .env variables are set
const envVariables = ["ADMIN_ID", "BOT_TOKEN", "PORT", "MONGO_URI", "AUTH_TOKEN"];
for (const envVariable of envVariables)
  if (Deno.env.get(envVariable) === undefined) console.log(envVariable + " not set in .env."), Deno.exit(0);

// Then start the bot
import("./initBot.ts");

// Create the web server app
const app = opine();
app.use(json());
app.use(opineCors());

// Use all the routes
app.use("/", router);

// Error handling
app.use((err: Error, _: CommonRequest, res: CommonResponse, __: NextFunction) => handleError(res, err));

const port = +Deno.env.get("PORT")!;
app.listen(port, () => console.log(`Listening on: http://localhost:${port}`));
