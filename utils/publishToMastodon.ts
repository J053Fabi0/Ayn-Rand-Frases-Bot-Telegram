import { createRestAPIClient } from "masto";
import { MASTODON_ACCESS_TOKEN, MASTODON_URL } from "../env.ts";

const masto = createRestAPIClient({
  url: MASTODON_URL,
  accessToken: MASTODON_ACCESS_TOKEN,
});

const publishToMastodon = masto.v1.statuses.create.bind(masto.v1.statuses);
export default publishToMastodon;
