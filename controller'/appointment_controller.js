import { catchAsyncError } from "../middleware/catchAsyncerror.js";
import ErrorHandler from "../middleware/errormiddleware.js";
import {Appointment} from "../models/appointment_schema.js";
import { User } from "../models/users_schema.js";

export const postAppointment = catchAsyncError(async (req, res, next) => {
    const{
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor_firstname,
        doctor_lastname,
        hasVisited=false ,
        address

    }=req.body;
    if((
        !firstname || 
        !lastname || 
        !email || 
        !phone || 
        !nic || 
        !dob ||
        !gender ||
        !appointment_date ||
        !department ||
        !doctor_firstname ||
        !doctor_lastname ||
        // !hasVisited||
        !address
    )){
        return next(new ErrorHandler("please fill full form",400));

    }
    const isConflict = await User.findOne({
        firstname:doctor_firstname,
        lastname:doctor_lastname,
        role:"Doctor",
        doctordepartment:department
    });
    if (!isConflict) {
        return next(new ErrorHandler("Doctor not found", 400));//changes
    }
    const doctorId = isConflict._id;
    const conflictingAppointment = await Appointment.findOne({
        doctorId,
        appointment_date
    });

    if (conflictingAppointment) {
        return next(new ErrorHandler("Doctor is already booked for the selected date and time", 400));
    }
    const patientId= req.user._id;
    const appointment=await Appointment.create({
        firstname,
        lastname,
        email,
        phone,
        nic,
        dob,
        gender,
        appointment_date,
        department,
        doctor:{
            firstname:doctor_firstname,
            lastname:doctor_lastname
        },
        hasVisited,
        doctorId,
        address,
        patientId
    });
    res.status(200).json({
        success:true,
        message:"Appointment created successfully",
        appointment
    });

    

});
export const getAllAppointments = catchAsyncError(async (req, res, next) => {
    const appointments = await Appointment.find();
    res.status(200).json({
        success: true,
        appointments
    });
});

 export const updateAppointment = catchAsyncError(async (req, res, next) => {
    const{id}=req.params;
    let appointment = await Appointment.findById(id)
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    appointment=await Appointment.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true,
        message:"Appointment updated successfully",
        appointment
    });


});
export const deleteAppointment = catchAsyncError(async (req, res, next) => {
    const{id}=req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
        return next(new ErrorHandler("Appointment not found", 404));
    }
    await appointment.deleteOne();
    res.status(200).json({
        success:true,
        message:"Appointment deleted successfully"
    });

});