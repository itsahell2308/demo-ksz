import { Router } from "express";
import * as movieController from "../controllers/movie.controller";

const router: Router = Router();

router.get("/", movieController.getAll);
router.post("/create", movieController.create);

export default router;
