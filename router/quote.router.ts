import { Router } from "../deps.ts";
import * as s from "../schemas/quote.schema.ts";
import * as c from "../controllers/opine/quote.controller.ts";

const quoteRouter = new Router();

quoteRouter.get("/quotes/:authorId", s.getQuotes, c.getQuotes);

quoteRouter.post("/quote", s.postQuote, c.postQuote);

quoteRouter.patch("/quote", s.patchQuote, c.patchQuote);

quoteRouter.delete("/quote/:idOrNumber", s.deleteQuote, c.deleteQuote);

export default quoteRouter;
