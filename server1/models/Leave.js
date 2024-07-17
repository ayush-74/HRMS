import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    empid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee"
    },
    reason:{
        type:String,
        required:true
    },
    fromDate:{
        type:Date,
        required:true
    },
    toDate:{
        type:Date,
        required:true
    },
    accepted:{
        type:Boolean,
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Leave = mongoose.model("Leave", leaveSchema);

export default Leave;