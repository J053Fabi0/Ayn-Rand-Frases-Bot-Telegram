import "dotenv";
export const PORT = Deno.env.get("PORT") as string;
export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") as string;
export const MONGO_URI = Deno.env.get("MONGO_URI") as string;
export const AUTH_TOKEN = Deno.env.get("AUTH_TOKEN") as string;
export const ADMIN_ID = parseInt(Deno.env.get("ADMIN_ID")!) as number;
