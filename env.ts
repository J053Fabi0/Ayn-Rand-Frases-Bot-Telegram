import { hash } from "./deps.ts";

import "std/dotenv/load.ts";
export const TIMEZONE = Deno.env.get("TIMEZONE")!;
export const BOT_TOKEN = Deno.env.get("BOT_TOKEN")!;
export const MONGO_URI = Deno.env.get("MONGO_URI")!;
export const WEBSITE_URL = Deno.env.get("WEBSITE_URL")!;
export const PUBLICATION_HOUR = +Deno.env.get("PUBLICATION_HOUR")!;
export const ADMINS_IDS = Deno.env.get("ADMINS_IDS")!.split(",").map(parseInt);

export const AUTH_TOKEN =
  typeof Deno.env.get("AUTH_TOKEN") === "string" ? await hash(Deno.env.get("AUTH_TOKEN")!) : "";

export const MASTODON_URL = Deno.env.get("MASTODON_URL")!;
export const MASTODON_HASHTAGS = Deno.env.get("MASTODON_HASHTAGS")!;
export const MASTODON_ACCESS_TOKEN = Deno.env.get("MASTODON_ACCESS_TOKEN")!;
