// load the .env file
import "dotenv";
import diffuse from "./utils/diffuse.ts";

// Check that all required .env variables are set
const envVariables = ["ADMIN_ID", "BOT_TOKEN", "MONGO_URI"];
for (const envVariable of envVariables)
  if (Deno.env.get(envVariable) === undefined) console.log(envVariable + " not set in .env."), Deno.exit(0);

// Then start the bot
import("./initBot.ts");

// Run whichever script is needed
await diffuse();
