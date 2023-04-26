import { Router } from "../deps.ts";
import * as s from "../schemas/author.schema.ts";
import * as c from "../controllers/opine/author.controller.ts";

const authorRoutes = new Router();

authorRoutes.use("/authors", s.getAuthors, c.getAuthors);

export default authorRoutes;
