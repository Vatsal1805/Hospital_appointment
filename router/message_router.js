import express from "express";
import { send_message,getAllMessages } from "../controller'/message_controller.js";
import {isAdminAuthenticated} from "../middleware/auth.js";
const router= express.Router();
router.post("/send",send_message);
router.get("/getall",isAdminAuthenticated,getAllMessages);
export default router;