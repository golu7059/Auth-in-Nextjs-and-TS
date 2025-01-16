import mongoose from "mongoose";

const userSchema = new  mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : [true ,"Email is required !" ],
        unique : true
    },
    password : {
        type : String,
        required : [true , "Password is required !"],
        minlength : 8,
        select : false 
    },
    isVerified : {
        type : Boolean ,
        default : false
    },
    isAdmin : {
        type : Boolean , 
        default : false
    },
    forgotPasswordToken : String ,
    forgotPasswordTokenExpiry : Date,
    verifyToken : String,
    verifyTokenExpiry : Date
},{
    timestamps : true
})

// first find the model in database and if not found create a new one
const User = mongoose.models.user || mongoose.model("user", userSchema);
export default User;