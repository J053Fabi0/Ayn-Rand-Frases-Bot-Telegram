import { Router } from "../deps.ts";
import * as s from "../schemas/quote.schema.ts";
import * as c from "../controllers/opine/quote.controller.ts";

const quoteRoutes = new Router();

quoteRoutes.get("/quotes/:authorId", s.getQuotes, c.getQuotes);

quoteRoutes.post("/quote", s.postQuote, c.postQuote);

quoteRoutes.patch("/quote", s.patchQuote, c.patchQuote);

quoteRoutes.delete("/quote/:id", s.deleteQuote, c.deleteQuote);

export default quoteRoutes;
