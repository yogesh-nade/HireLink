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
        default:12345
    },
    
    gender:{
        type:String,
        required:true,
        enum: ['Male', 'Female','Others']
    },
   
    image:{
        type:String,
        required:true 
    },
    mobile:{
        type:Number,
        required:true
    },
    
    main_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    }
    
});

module.exports  = mongoose.model('admin',userSchema);