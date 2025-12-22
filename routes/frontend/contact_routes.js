import express from "express";
import { sendContactEmail } from "../../controllers/contact_controller.js";

const router = express.Router();

router.post("/send-email", sendContactEmail);

export default router;
