import { State } from "../types/state.type.ts";
import redirect from "./redirect.ts";

export default async function handlePostFilters(
  redirectPath: string,
  reqOrForm: Request | FormData,
  state: State
) {
  const finalForm = reqOrForm instanceof FormData ? reqOrForm : await reqOrForm.formData();

  const authorId = finalForm.get("author")?.toString();
  const sourceId = finalForm.get("source")?.toString() || "all";

  if (!authorId) return new Response("Missing author", { status: 400 });

  state.session.set("authorId", authorId);
  state.session.set("sourceId", sourceId);

  return redirect(redirectPath);
}
