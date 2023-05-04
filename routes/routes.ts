import { Router } from "../deps.ts";
import quoteRoutes from "./quote.routes.ts";
import authorRoutes from "./author.routes.ts";
import sourceRoutes from "./source.routes.ts";
import authController from "../middlewares/auth.ts";
import { auth as authSchema } from "../schemas/auth.schema.ts";

const router = Router();

// Auth for every route.
router.use(authSchema, authController);

// Default response.
router.get("/", (_, res) => res.sendStatus(200));

router.use(authorRoutes);
router.use(quoteRoutes);
router.use(sourceRoutes);

export default router;
