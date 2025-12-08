import express from "express";
import { SignIn } from "../../controllers/auth_controller.js";

const router = express.Router();

router.post("/signin", SignIn);

export default router;
