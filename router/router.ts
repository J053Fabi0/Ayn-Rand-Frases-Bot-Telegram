import { Router } from "../deps.ts";
import quoteRouter from "./quote.router.ts";
import authorRouter from "./author.router.ts";
import sourceRouter from "./source.router.ts";
import authController from "../middlewares/auth.ts";
import { auth as authSchema } from "../schemas/auth.schema.ts";

const router = Router();

// Auth for every route.
router.use(authSchema, authController);

// Default response.
router.get("/", (_, res) => res.sendStatus(200));

router.use(quoteRouter);
router.use(authorRouter);
router.use(sourceRouter);

export default router;
