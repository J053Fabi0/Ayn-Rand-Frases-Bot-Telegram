// load the .env file
import "dotenv";

// Check that all required .env variables are set
const envVariables = ["ADMIN_ID", "BOT_TOKEN"];
for (const envVariable of envVariables)
  if (Deno.env.get(envVariable) === undefined) console.log(envVariable + " not set in .env."), Deno.exit(0);

// Then start the bot
import("./initBot.ts");
