import { Router } from "../deps.ts";
import auth from "../middlewares/auth.ts";

const router = Router();

// Default response.
router.get("/", auth, (_, res) => res.sendStatus(200));

export default router;
