import redirect from "../../utils/redirect.ts";
import { State } from "../../types/state.type.ts";
import Quote from "../../types/collections/quote.type.ts";
import isMongoId from "../../types/typeGuards/isMongoId.ts";
import { getQuote } from "../../controllers/mongo/quote.controller.ts";
import { Filter, MiddlewareHandlerContext, ObjectId } from "../../deps.ts";

const urlPatterns = ["/quote/edit/:id", "/quote/delete/:id", "/quote/:id"].map(
  (pathname) => new URLPattern({ pathname })
);

export async function handler(req: Request, ctx: MiddlewareHandlerContext<State>) {
  for (const pattern of urlPatterns) {
    const groups = pattern.exec(req.url)?.pathname.groups as { id?: string } | undefined;
    if (!groups || !groups.id) continue;

    const filter: Filter<Quote> = { archived: { $ne: true } };
    if (isMongoId(groups.id)) {
      filter._id = new ObjectId(groups.id);
    } else {
      filter.number = +groups.id;
      if (isNaN(filter.number)) {
        ctx.state.quoteExists = false;
        return ctx.next();
      }
    }

    const possibleQuote = await getQuote(filter, { projection: { number: 1 } });
    ctx.state.quoteExists = Boolean(possibleQuote);

    // If using the ObjectId, redirect to the quote number
    if (filter._id && possibleQuote) return redirect(pattern.pathname.replace(":id", `${possibleQuote.number}`));

    break;
  }

  return ctx.next();
}
