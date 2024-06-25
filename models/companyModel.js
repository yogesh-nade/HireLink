const mongoose =require("mongoose");

const companySchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    companyId:{
        type:String,
        required:true
    },
    branch:{
        type:String,
        required:true,
        enum: ['CSE', 'ECE','Both']
    },
    cgpa:{
        type:String,
        required:true 
    },
    regDate:{
        type:Date,
        get: function(value) {
            // Format the date to your desired format
            return value.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        },
        required:true 
    },
    
    description:{
        type:String,
        required:true 
    },

    file:{
        type:String,
        required:true 
    },
    intrDate:{
        type:Date,
        get: function(value) {
            // Format the date to your desired format
            return value.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            });
        },
        required:true 
    },
    totalReq:{
        type:Number,
        required:true
    },
    placed:{
        type:Number,
        default:0
    },
    rollNumbers: {
        type: [String],
        default: []
    },
    
    
});

 module.exports = mongoose.model("Company", companySchema);