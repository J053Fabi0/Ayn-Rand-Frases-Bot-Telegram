import { hash } from "./deps.ts";

import "std/dotenv/load.ts";
export const TIMEZONE = Deno.env.get("TIMEZONE") as string;
export const BOT_TOKEN = Deno.env.get("BOT_TOKEN") as string;
export const MONGO_URI = Deno.env.get("MONGO_URI") as string;
export const WEBSITE_URL = Deno.env.get("WEBSITE_URL") as string;
export const PUBLICATION_HOUR = +Deno.env.get("PUBLICATION_HOUR")!;
export const ADMINS_IDS = Deno.env.get("ADMINS_IDS")!.split(",").map(parseInt);

export const AUTH_TOKEN =
  typeof Deno.env.get("AUTH_TOKEN") === "string" ? await hash(Deno.env.get("AUTH_TOKEN")!) : "";

export const MASTODON_URL = Deno.env.get("MASTODON_URL") as string;
export const MASTODON_ACCESS_TOKEN = Deno.env.get("MASTODON_ACCESS_TOKEN") as string;
