import { Router } from "../deps.ts";
import quoteRoutes from "./quoteRoutes.ts";
import authorRoutes from "./authorRoutes.ts";
import authController from "../middlewares/auth.ts";
import { auth as authSchema } from "../schemas/auth.schema.ts";

const router = Router();

// Auth for every route.
router.use(authSchema, authController);

// Default response.
router.get("/", (_, res) => res.sendStatus(200));

router.use(authorRoutes);
router.use(quoteRoutes);

export default router;
