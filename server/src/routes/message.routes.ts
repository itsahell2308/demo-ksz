import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.post("/send/:id", auth, messageController.sendMessage);
router.get("/:id", auth, messageController.getMessages);

export default router;
