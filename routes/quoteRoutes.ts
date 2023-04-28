import { Router } from "../deps.ts";
import * as s from "../schemas/quote.schema.ts";
import * as c from "../controllers/opine/quote.controller.ts";

const quoteRoutes = new Router();

quoteRoutes.use("/quotes/:authorId", s.getQuotes, c.getQuotes);

export default quoteRoutes;
