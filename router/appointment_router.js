import express from 'express';
import { deleteAppointment,updateAppointment,postAppointment,getAllAppointments } from "../controller'/appointment_controller.js";
import { isPatientAuthenticated,isAdminAuthenticated } from '../middleware/auth.js';
const router = express.Router();

router.post("/post",isPatientAuthenticated,postAppointment)
router.get("/getall",isAdminAuthenticated,getAllAppointments)
router.put("/update/:id",isAdminAuthenticated,updateAppointment)
router.delete("/delete/:id",isAdminAuthenticated,deleteAppointment)
export default router;