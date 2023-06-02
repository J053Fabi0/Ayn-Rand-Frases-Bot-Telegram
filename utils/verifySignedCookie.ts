import { BOT_TOKEN } from "../env.ts";
import { verifySignedCookie as verifySignedCookieCtrl } from "../deps.ts";

/**
 * Verify a signed cookiet.
 *
 * ### usage:
 * ```ts
 * await verifySignedCookie(headers, 'id')
 * // false or cookie value
 * ```
 */
export default function verifySignedCookie(headers: Headers, cookie_name: string) {
  return verifySignedCookieCtrl(headers, cookie_name, BOT_TOKEN);
}
