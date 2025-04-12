import mongoose from "mongoose";
import validator from "validator";

const messgage_schema=new mongoose.Schema({
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
    message:{
        type: String,
        required: true,
        minlength:[10,"message must contain  10 character "],
       

    }

});
export const Message=mongoose.model("Message",messgage_schema);