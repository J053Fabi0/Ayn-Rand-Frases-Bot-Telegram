import { Router } from "../deps.ts";
import * as s from "../schemas/source.schema.ts";
import * as c from "../controllers/opine/source.controller.ts";

const sourceRouter = new Router();

sourceRouter.get("/sources/:authorId", s.getSource, c.getSources);

sourceRouter.post("/source", s.postSource, c.postSource);

sourceRouter.patch("/source", s.patchSource, c.patchSource);

sourceRouter.delete("/source/:id", s.deleteSource, c.deleteSource);

export default sourceRouter;
