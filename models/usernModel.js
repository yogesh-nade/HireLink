const mongoose=require("mongoose");

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        //lowercase
        type:String,
        required:true,
        unique:true,
        match: [/^ui\d{2}[a-zA-Z]{2}\d{2}@iiitsurat\.ac\.in$/, 'Invalid email format']
    },
    password:{
        type:String,
        required:true,
    },
    branch:{
        type:String,
        required:true,
        enum: ['CSE', 'ECE']
    },
    gender:{
        type:String,
        required:true,
        enum: ['Male', 'Female','Others']
    },
    regNum:{
        //uppercase
        type:String,
        required:true,
        unique:true,
        match: [/^UI\d{2}[a-zA-Z]{2}\d{2}$/, 'Invalid registration number format']
    },
    image:{
        type:String,
        required:true 
    },
    mobile:{
        type:Number,
        required:true
    },
    cgpa:{
        type:String,
        required:true 
    },
    
    is_verified:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:0
    },
    offer:{
        type:Number,
        default:0
    },
    totalApplied:{
        type:Number,
        default:0
    },
});

module.exports  = mongoose.model('Usern',userSchema);