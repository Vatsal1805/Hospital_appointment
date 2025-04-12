import {catchAsyncError} from "../middleware/catchAsyncerror.js";
import ErrorHandler from "../middleware/errormiddleware.js";
import {User} from "../models/users_schema.js";
import {generateToken} from "../utils/jwt_tokens.js"
import cloudinary from "cloudinary";

export const patientRegister=catchAsyncError(async(req,res,next)=>{
    const {firstname,lastname,email,phone,password,gender,dob,nic,role,}=req.body;
    if(!firstname || !lastname || !email || !phone || !password || !gender || !dob || !nic || !role){
        return next(new ErrorHandler("please fill full form",400));

    }
    let user=await User.findOne({email});
    if(user){
        return next(new ErrorHandler("user already registered",400));
    }
    user= await User.create({firstname,lastname,email,phone,password,gender,dob,nic,role,})
    generateToken(user,"user Registered",200,res)
    });
 

export const login=catchAsyncError(async(req,res,next)=>{
    const {email,password,confirmPassword,role}=req.body;
    if(!email ||!password || !confirmPassword|| !role){
         return next(new ErrorHandler("please provide all details",400));
    
    }
    if(password !== confirmPassword){
        return next(new ErrorHandler("password and confirmed password does not match",400));

    }
    const user=await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("User not found due to invaild email or password",400));


    }
    const isPasswordMatched=await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("invaild email or password",400));
    }
    if(role !== user.role){
        return next(new ErrorHandler("user with this role not found",400));

    }
    generateToken(user,"user login successfully",200,res)
});

export const addnewAdmin = catchAsyncError(async (req, res, next) => {
    const { firstname, lastname, email, phone, password, gender, dob, nic } = req.body;

    // Check if all required fields are provided
    if (!firstname || !lastname || !email || !phone || !password || !gender || !dob || !nic) {
        return next(new ErrorHandler("Please fill the full form", 400));
    }

    // Check if the user is already registered
    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler(`${isRegistered.role} with this Email already registered`, 400));
    }

    // Create a new admin
    const admin = await User.create({
        firstname,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        role: "Admin",
    });

    // Send the success response
    res.status(200).json({
        success: true,
        message: "New admin registered successfully",
        admin: {
            id: admin._id,
            firstname: admin.firstname,
            lastname: admin.lastname,
            email: admin.email,
            dob:admin.dob
        },
    });
});

export const getAllDoctors = catchAsyncError(async (req, res, next) => {
    const doctor=await User.find({role:"Doctor"});
    res.status(200).json({
        success:true,
        doctor
    })
})

export const getUserdetails=catchAsyncError(async(req,res,next)=>{
    const User=req.user
    res.status(200).json({
        success:true,
        User});
});

export const logoutAdmin=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("adminToken","",{
        expires:new Date(Date.now()),
        httpOnly:true

    }).json({
        success:true,
        message:"admin logout successfully"
    })
})

export const logoutPatient=catchAsyncError(async(req,res,next)=>{
    res.status(200).cookie("patientTOken","",{
        expires:new Date(Date.now()),
        httpOnly:true

    }).json({
        success:true,
        message:"patient logout successfully"
    })
})

// export const addnewDoctor = catchAsyncError(async (req, res, next) => {
//     // Validate file upload
//     if (!req.files || Object.keys(req.files).length === 0) {
//         return next(new ErrorHandler("please upload doc avtar", 400));
//     }

//     const { docAvtar } = req.files;
//     const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
//     if (!allowedFormats.includes(docAvtar.mimetype)) {
//         return next(new ErrorHandler("this file format is not supported", 400));
//     }

//     // Validate form data
//     const { firstname, lastname, email, phone, password, gender, dob, nic, doctordepartment } = req.body;
//     if (!firstname || !lastname || !email || !phone || !password || !gender || !dob || !nic || !doctordepartment) {
//         return next(new ErrorHandler("please fill full form", 400));
//     }

//     // Check if email is already registered
//     const isRegistered = await User.findOne({ email });
//     if (isRegistered) {
//         return next(new ErrorHandler(`${isRegistered.role} already registered`, 400));
//     }

//     // Upload avatar to Cloudinary
//     const cloudinaryResponse = await cloudinary.uploader.upload(docAvtar.tempFilePath);
//     if (!cloudinaryResponse || cloudinaryResponse.error) {
//         console.error("Cloudinary error:", cloudinaryResponse.error || "unknown cloudinary error");
//         return next(new ErrorHandler("Failed to upload avatar", 500));
//     }

//     // Create new doctor
//     const doctor = await User.create({
//         firstname,
//         lastname,
//         email,
//         phone,
//         password,
//         gender,
//         dob,
//         nic,
//         role: "Doctor",
//         docAvtar: {
//             public_id: cloudinaryResponse.public_id,
//             url: cloudinaryResponse.secure_url,
//         },
//     });

//     // Respond with success
//     res.status(200).json({
//         success: true,
//         message: "New doctor registered successfully",
//         doctor,
//     });
// });

export const addnewDoctor = catchAsyncError(async (req, res, next) => {
    // console.log("Received request:", req.body, req.files); // Debugging

    // // Check if files exist
    // if (!req.files || Object.keys(req.files).length === 0) {
    //     return next(new ErrorHandler("please upload doc avtar", 400));
    // }

    // const { docAvtar } = req.files;

    // // Validate MIME type
    // const allowedFormats = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    // console.log("Uploaded file MIME type:", docAvtar.mimetype);

    // if (!allowedFormats.includes(docAvtar.mimetype)) {
    //     return next(new ErrorHandler("this file format is not supported", 400));
    // }

    // Validate form fields
    const { firstname, lastname, email, phone, password, gender, dob, nic, doctordepartment } = req.body;
    if (!firstname || !lastname || !email || !phone || !password || !gender || !dob || !nic || !doctordepartment) {
        return next(new ErrorHandler("please fill full form", 400));
    }

    // Process Cloudinary upload
    // const cloudinaryResponse = await cloudinary.uploader.upload(docAvtar.tempFilePath);
    // console.log("Cloudinary response:", cloudinaryResponse);

    // if (!cloudinaryResponse || cloudinaryResponse.error) {
    //     return next(new ErrorHandler("Cloudinary upload failed", 500));
    // }

    // Create doctor in the database
    const doctor = await User.create({
        firstname,
        lastname,
        email,
        phone,
        password,
        gender,
        dob,
        nic,
        doctordepartment,
        role: "Doctor",
        // docAvtar: {
        //     public_id: cloudinaryResponse.public_id,
        //     url: cloudinaryResponse.secure_url,
        // },
    });

    // Send response
    res.status(200).json({
        success: true,
        message: "New doctor registered successfully",
        doctor,
    });
});
