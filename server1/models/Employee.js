import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    image:{
        type:String
    },
    category_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    leaves:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Leave"
    }]
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;