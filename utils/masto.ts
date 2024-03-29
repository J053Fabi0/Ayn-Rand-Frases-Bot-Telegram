import { createRestAPIClient } from "masto";
import { MASTODON_ACCESS_TOKEN, MASTODON_URL } from "../env.ts";

const masto = createRestAPIClient({
  url: MASTODON_URL,
  accessToken: MASTODON_ACCESS_TOKEN,
});

export default masto;
