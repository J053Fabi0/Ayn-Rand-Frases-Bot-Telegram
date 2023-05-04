import { Router } from "../deps.ts";
import * as s from "../schemas/source.schema.ts";
import * as c from "../controllers/opine/source.controller.ts";

const sourceRoutes = new Router();

sourceRoutes.get("/sources/:authorId", s.getSource, c.getSources);

export default sourceRoutes;
