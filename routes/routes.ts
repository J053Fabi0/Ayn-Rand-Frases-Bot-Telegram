import { Router } from "../deps.ts";
import authorRoutes from "./authorRoutes.ts";
import authController from "../middlewares/auth.ts";
import { auth as authSchema } from "../schemas/auth.schema.ts";

const router = Router();

// Default response.
router.get("/", authSchema, authController, (_, res) => res.sendStatus(200));

router.use(authorRoutes);

export default router;
