import mongoose from "mongoose";
import validator from "validator";

const appointment_schema=new mongoose.Schema({
    firstname:{
        type: String,
        required: true,
        minlength:[3,"first name must contain atleast 3 character"]

    },
    lastname:{
        type: String,
        required: true,
        minlength:[3,"last name must contain atleast 3 character"]

    },
    email:{
        type: String,
        required: true,
        validate:[validator.isEmail,"please provide a valid email"]
    },
    phone:{
        type: String,
        required: true,
        minlength:[11,"phone number must contain exactly 11 digits "],
        maxlength:[11,"phone number must contain exactly 11 digits "]

    },
    nic:{
        type: String,
        required: true,
        minlength:[12,"nic number must contain exactly 12 digits "],
        maxlength:[12,"nic number must contain exactly 12 digits "]

    },
    dob:{
        type:String,
        required:[true,"DOB is required"]
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"]

    },
    appointment_date:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    doctor:{
        firstname:{
            type:String,
            required:true
        },
        lastname:{
            type:String,
            required:true
        },
        
    },
    hasVisited:{
        type:Boolean,
        required: true
    },
    doctorId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected"],
        default:"Pending"
    }



});
export const Appointment=mongoose.model("Appointment",appointment_schema)