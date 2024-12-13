import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";

const router: Router = Router();

router.get("/", auth, userController.allUsers);

export default router;
