import { Router } from "../deps.ts";
import * as s from "../schemas/author.schema.ts";
import * as c from "../controllers/opine/author.controller.ts";

const authorRouter = new Router();

authorRouter.get("/authors", s.getAuthors, c.getAuthors);

authorRouter.post("/author", s.postAuthor, c.postAuthor);

authorRouter.patch("/author", s.patchAuthor, c.patchAuthor);

authorRouter.delete("/author/:id", s.deleteAuthor, c.deleteAuthor);

export default authorRouter;
