import { Router } from "../deps.ts";
import * as s from "../schemas/source.schema.ts";
import * as c from "../controllers/opine/source.controller.ts";

const sourceRoutes = new Router();

sourceRoutes.get("/sources/:authorId", s.getSource, c.getSources);

sourceRoutes.post("/source", s.postSource, c.postSource);

sourceRoutes.patch("/source", s.patchSource, c.patchSource);

export default sourceRoutes;
