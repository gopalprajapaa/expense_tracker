import {model, Schema} from "mongoose"
import bcrypt, { hash } from "bcrypt"

const userSchema=new Schema({
    fullname:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
      mobile:{
        type:String,
        required:true,
        trim:true
    },
     email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
     password:{
        type:String,
        required:true,
        trim:true
    },
     status:{
       type:Boolean,
       default:true
    },
     role:{
        type:String,
        default:"user",
        enum:["user","admin"]
    }
},{timestamps:true});

userSchema.pre("save", async function (next){
      const hashpassword=await bcrypt.hash(this.password.toString(),12);
      this.password=hashpassword;
      next;
})

const userModel=model("User",userSchema);
export default userModel;