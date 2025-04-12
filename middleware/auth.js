import { catchAsyncError } from "./catchAsyncerror.js";
import ErrorHandler from "./errormiddleware.js";
import jwt from "jsonwebtoken";
import { User } from "../models/users_schema.js";
export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
    const token =req.cookies.adminToken;
    if(!token){
        return next(new ErrorHandler("admin not authenticated",400));
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY  );
    req.user=await User.findById(decoded.id)
    if(req.user.role!=="Admin"){
        return next(
            new ErrorHandler(` ${req.user.role} not authorized`,403)
        )
    }
    next()

});

export const isPatientAuthenticated = catchAsyncError(async (req, res, next) => {
    const token =req.cookies.patientTOken;
    if(!token){
        return next(new ErrorHandler("Patient not authenticated",400));
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY  );
    req.user=await User.findById(decoded.id)
    if(req.user.role!=="Patient"){
        return next(
            new ErrorHandler(` ${req.user.role} not autheroized`,403)
        )
    }
    next()

})
