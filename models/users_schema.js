import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const user_schema=new mongoose.Schema({
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
    password:{
        type:String,
        minlength:[8,"password must contain at least 8 characters"],
        required:true,
        select:false
    },
    role:{
        type:String,
        required:true,
        enum:["Admin","Patient","Doctor"],


    },
    doctordepartment:{
        type:String,
    },
    docAvtar:{
        public_id:String,
        url:String,
    }


});

user_schema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password,10);
})

user_schema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);

}

user_schema.methods.generateJsonWebToken=function(){
    return jwt.sign({id: this._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRES
    })
}


// export const User =mongoose.model("User",user_schema);
export const User =mongoose.model("User",user_schema);