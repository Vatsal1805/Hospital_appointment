import {catchAsyncError} from '../middleware/catchAsyncerror.js'
import { Message } from "../models/message_schema.js";
import ErrorHandler from "../middleware/errormiddleware.js";

export const send_message=catchAsyncError(async(req,res,next)=>{
    
    const{firstname,lastname,email,phone,message}=req.body;
    if(!firstname || !lastname || !email || !phone || !message){
        return next(new ErrorHandler("pelase fill full form",400));
        
    }
    await Message.create({firstname,lastname,email,phone,message});
        res.status(200).json({
            success:true,
            message:"form filed"
        });
})

export const getAllMessages=catchAsyncError(async(req,res,next)=>{
    const messages=await Message.find();
    res.status(200).json({
        success:true,
        messages
    })
})