import redirect from "./redirect.ts";
import createSignedCookie from "./createSignedCookie.ts";

export default async function handlePostFilters(redirectPath: string, reqOrForm: Request | FormData) {
  const finalForm = reqOrForm instanceof FormData ? reqOrForm : await reqOrForm.formData();

  const authorId = finalForm.get("author")?.toString();
  const sourceId = finalForm.get("source")?.toString() || "all";

  if (!authorId) return new Response("Missing author", { status: 400 });

  const { headers } = await createSignedCookie("authorId", authorId, { httpOnly: true });
  const { cookie } = await createSignedCookie("sourceId", sourceId, { httpOnly: true });
  headers.append("Set-Cookie", cookie);

  return redirect(redirectPath, { headers });
}
