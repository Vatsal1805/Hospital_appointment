import mongoose from "mongoose";
export const dbconnection=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbname: "appointment_management"
    }).then(()=>{
        console.log("connected to databse")
    }).catch(err=>{
        console.log(`some error occured while connectiong database: ${err}`);
    });
};