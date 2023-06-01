import { HandlerContext } from "../deps.ts";

const defaultUrlPattern = new URLPattern({ pathname: "/:base/:action/:id?" });

export default function getActionAndId<Data, State>(
  req: Request,
  ctx: HandlerContext<Data, State>,
  urlPattern: URLPattern = defaultUrlPattern
) {
  const groups = urlPattern.exec(req.url)!.pathname.groups as { action: "edit" | "new"; id?: string };
  console.log(groups);

  // only allow /quote/new and /quote/edit/:id
  if (groups.action === "edit" && !groups.id) return ctx.renderNotFound();
  if (groups.action === "new" && groups.id) return ctx.renderNotFound();

  return groups;
}
