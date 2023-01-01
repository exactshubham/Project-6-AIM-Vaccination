const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    Name:{
        type:String,
        required:true
    },
    PhoneNumber:{
        type:String,
        required:true
    },
    Age:{
        type:String,
        required:true
    },
    Pincode:{
        type:String,
        required:true
    },
    AadharNo:{
        type:String,
        required:true
    },
    Password:{
        type:String
    },
    Type:{
        type:String,
        default:'user'
    },
    
    VaccinationStatus:{
        type:String,
        enum:["First dose completed","All completed","none"],
        default : "none"
    }
})

module.exports=mongoose.model('User',userSchema)