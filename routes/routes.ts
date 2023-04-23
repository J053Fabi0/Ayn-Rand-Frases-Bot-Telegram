import { Router } from "../deps.ts";

const router = Router();

// Default response.
router.get("/", (_, res) => res.sendStatus(200));

export default router;
