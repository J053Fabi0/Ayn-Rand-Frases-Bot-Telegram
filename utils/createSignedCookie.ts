import { BOT_TOKEN } from "../env.ts";
import { createSignedCookie as createSignedCookieCtrl, CookieOptions } from "../deps.ts";

/**
 * Create a signed cookie. **returns** the cookie string and headers
 *
 * ### usage:
 * ```ts
 * const { cookie } = await createSignedCookie('id', '1', { httpOnly: true })
 * // id=1....
 * ```
 */
export default function createSignedCookie(
  cookie_name: string,
  cookie_value: string,
  opts: CookieOptions = { path: "/" }
) {
  return createSignedCookieCtrl(cookie_name, cookie_value, BOT_TOKEN, opts);
}
