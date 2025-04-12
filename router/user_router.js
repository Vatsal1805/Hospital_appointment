import express from "express";
import { addnewAdmin, addnewDoctor, getAllDoctors, getUserdetails, login,logoutAdmin,patientRegister } from "../controller'/user_controller.js";
import { isAdminAuthenticated,isPatientAuthenticated } from "../middleware/auth.js";
import { logoutPatient } from "../controller'/user_controller.js"; // Adjust the path as needed


const router=express.Router();
router.post("/patient/register",patientRegister);
router.post("/login",login);
router.post("/admin/addnew",isAdminAuthenticated,addnewAdmin);
router.get("/doctors",getAllDoctors);
router.get("/admin/me",isAdminAuthenticated,getUserdetails)
router.get("/patient/me",isPatientAuthenticated,getUserdetails)
router.get("/admin/logout",isAdminAuthenticated,logoutAdmin)
router.get("/patient/logout",isPatientAuthenticated,logoutPatient)
router.post("/doctor/addnew",isPatientAuthenticated,addnewDoctor)


export default router;