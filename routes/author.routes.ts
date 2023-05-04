import { Router } from "../deps.ts";
import * as s from "../schemas/author.schema.ts";
import * as c from "../controllers/opine/author.controller.ts";

const authorRoutes = new Router();

authorRoutes.get("/authors", s.getAuthors, c.getAuthors);

authorRoutes.post("/author", s.postAuthor, c.postAuthor);

authorRoutes.patch("/author", s.patchAuthor, c.patchAuthor);

export default authorRoutes;
