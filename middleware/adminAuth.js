const is_Login = async(req,res,next)=>{
    try{
        if(req.session.user_id){}
        else{
            res.redirect('/admin');
        }
        next();
    }catch(error){
        console.log(error.message);
    }
}

const is_Logout = async(req,res,next)=>{
    try{
        if(req.session.user_id){
            res.redirect('/admin/home')
        }
        next();
    }catch(error){
        console.log(error.message);
    }
}
module.exports = {
    is_Login,
    is_Logout
}