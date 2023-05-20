import { Router } from "../deps.ts";
import quoteRoutes from "./quote.router.ts";
import authorRoutes from "./author.router.ts";
import sourceRoutes from "./source.router.ts";
import authController from "../middlewares/auth.ts";
import { auth as authSchema } from "../schemas/auth.schema.ts";

const router = Router();

// Auth for every route.
router.use(authSchema, authController);

// Default response.
router.get("/", (_, res) => res.sendStatus(200));

router.use(quoteRoutes);
router.use(authorRoutes);
router.use(sourceRoutes);

export default router;
