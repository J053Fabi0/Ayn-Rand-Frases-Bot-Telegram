import redirect from "./redirect.ts";
import createSignedCookie from "./createSignedCookie.ts";

export default async function handlePostFilters(redirectPath: string, req: Request) {
  const form = await req.formData();

  const authorId = form.get("author")?.toString();
  const sourceId = form.get("source")?.toString() || "null";

  if (!authorId) return new Response("Missing author", { status: 400 });

  const { headers } = await createSignedCookie("authorId", authorId, { httpOnly: true });
  const { cookie } = await createSignedCookie("sourceId", sourceId, { httpOnly: true });
  headers.append("Set-Cookie", cookie);

  return redirect(redirectPath, { headers });
}
