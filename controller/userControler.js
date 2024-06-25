const User=require("../models/userModel");  //importing model created 
const Usern=require("../models/usernModel");
const Company=require("../models/companyModel");
const bcrypt =require('bcrypt');
const express = require("express");
const nodemailer=require("nodemailer");
const randormstring = require('randomstring');


const securePassword=async(password)=>{
    try{
        const passwordHash =await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

// for sending mail
const SendVerifyMail =async(name,email,user_id)=>{
    try{
        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'yogesh1940.ac.in@gmail.com',
                pass:'psbs fkrk cxhf jurt'
            }
        });
        const mailOptions={
            from:'yogesh1940.ac.in@gmail.com',
            to:email,
            subject:'For Email verification',
            html:'<p>Hii '+name+', please click here to <a href="http://localhost:3000/verify?id='+user_id+'">verify</a> your mail.</p>'
        }

        transporter.sendMail(mailOptions ,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log('Email has been sent:',info.response);
            }
        })
    } catch(error) {
        console.log(error.message);
    }
}

const loadFirst = async(req,res)=>{
    try{
        
        res.render('logout');
     }
    catch(error){
        console.log(error.message);
    }
}

const loadRegister = async(req,res)=>{
    try{
        res.render('registration',{redirectFromVerifyMail: false});
     }
    catch(error){
        console.log(error.message);
    }
}

const loadRegisterHome = async(req,res)=>{
    try{
        const id =req.query.id;
        const userData=await Usern.findById({_id:id});
        const companyData=await Company.find();
        res.render('homePage', { user:userData, company: companyData});
        }
    catch(error){
        console.log(error.message);
    }
}

const loadProfile = async(req,res)=>{
    try{
        const id =req.query.id;
        const userData=await Usern.findById({_id:id});
        const companyData=await Company.find();
        res.render('profile', { user:userData, company: companyData});
        }
    catch(error){
        console.log(error.message);
    }
}

const loadCompany = async(req,res)=>{
    try{
        const companies= await Company.find();
        const id =req.query.id;
        const userData=await Usern.findById({_id:id});
        const eligibleCompanies = [];
        if(companies.length>0){
            for (let i = 0; i < companies.length; i++)  {
            if (companies[i].cgpa <= userData.cgpa && (companies[i].branch === userData.branch || companies[i].branch === 'Both')) {
                 eligibleCompanies.push(companies[i]);}}}
    


        res.render('company', { Company: eligibleCompanies,user:userData });}
    catch(error){
        console.log(error.message);
    }
}

const applyInCompany = async(req,res)=>{
    try{
        const id= req.query.id;
        const userData= await Usern.findById({_id:id});
        const idd= req.query.idd;
        const company=await Company.findById({_id:idd});
        const companies=await Company.find();
        const eligibleCompanies = [];
        if (company) {
            company.rollNumbers.push(userData.regNum);
            await company.save();  //saving the updated data

            if(companies.length>0){
                for (let i = 0; i < companies.length; i++)  {
                if (companies[i].cgpa <= userData.cgpa && (companies[i].branch === userData.branch || companies[i].branch === 'Both')) {
                     eligibleCompanies.push(companies[i]);}}}
                res.render('company', { Company: eligibleCompanies,user:userData });}
        } 
    catch(error){
        console.log(error.message);
    }
}


const insertUser =async(req,res)=>{
    try{
        const spassword =await securePassword(req.body.password);
        const user = new Usern({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            cgpa:req.body.cgpa,
            regNum:req.body.regNum,
            branch:req.body.branch,
            gender:req.body.gender,
            image:req.file.filename,
            password:spassword,
            

        });
        const userData = await user.save();
        if (userData) {
            SendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration', { message: "Registration successful, <br> please verify your email and then login into your account ", success: true ,redirectFromVerifyMail: true});
        } else {
            res.render('registration', { message: "Registration failed", success: false ,redirectFromVerifyMail: true });
        }
        
        
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyMail=async(req,res)=>{
    try{
        const updateInfo=await Usern.updateOne({_id:req.query.id},{ $set:{ is_verified:1 }});
        console.log(updateInfo);
        res.render("email-verify");

    }catch(error){
        console.log(error.message)
    }
}

//login user
const loadRegisterLogin = async(req,res)=>{
    try{
        
        res.render('login');
     }
    catch(error){
        console.log(error.message);
    }
}

const loadRegisterLogout = async(req,res)=>{
    try{
        
        await req.session.destroy();
        res.redirect('/first');
     }
    catch(error){
        console.log(error.message);
    }
}

const loadRegisterForget = async(req,res)=>{
    try{
        
        res.render('forget');

    }
    catch(error){
        console.log(error.message);
    }
}

// update profile 
const loadEditProfle = async(req,res)=>{
    try{
        const id =req.query.id;
        const userData=await Usern.findById({_id:id});
        if(userData){
            res.render('editProfile',{user:userData});
        }else{
            res.redirect('/home')
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=>{
    try{
        const id =req.query.id;
        const userData=await User.findById({_id:id});
        if(req.file){
            const userData= await Usern.findByIdAndUpdate({_id:req.body.idd},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile, image:req.file.filename}})
        }else{
         const userData= await Usern.findByIdAndUpdate({_id:req.body.idd},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile,cgpa:req.body.cgpa,}});
        }
        const user=await Usern.findById({_id:req.body.idd});
        res.render('profile', { user:user});
    }
    catch(error){
        console.log(error.message);
    }
}


const loadRegisterResetPW = async(req,res)=>{
    try{
        const token =req.query.token;
        const tokenData=await User.findOne({token:token});
        if(tokenData){
            res.render('forget_pass',{user_id:tokenData._id});
        }else{
            res.render('404',{message:"Token is invalid"})
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const ResetPassword = async(req,res)=>{
    try{
        console.log(req.body.password);
        console.log(req.body.user_id);
       const secure_pass=await securePassword(req.body.password);
       console.log(secure_pass);
       const updateDataT=await User.updateOne({ _id:req.body.user_id},{ $set:{ token:''}});
       const updateDataP=await User.updateOne({ _id:req.body.user_id},{ $set:{ password:secure_pass}});
       const user= await User.findById({ _id: req.body.user_id });
        res.render('homePage', { user: user });
    res.render('homePage');
    }
    catch(error){
        console.log(error.message);
    }
}
const verifyLogin = async(req,res)=>{
    try{
        console.log("Request Body:", req.body);
        //const email=req.body.email;
        const email=req.body.email.toString();
        const password=req.body.password;

        // Process each login request in the array
        // const results = await Promise.all(req.body.map(async (loginData) => {
        //     const email = loginData.email ? loginData.email.toString() : undefined;
        //     const password = loginData.password;


        // Check if email and password are defined
        // if (!email || !password) {
        //     return res.status(400).json({
        //         message: "Email and password are required",
        //         body: req.body // Send the request body back in the response
        //     });
        // }

        const userData=await Usern.findOne({ email:email });
        

        if(userData){
            // console.log("email matched");
            const passwordMatch=await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                // console.log("password matched")
                if(userData.is_verified==0){
                    // return res.status(200).json({
                    //     message: "Please verify your mail",
                    //     body: req.body // Send the request body back in the response
                    // });
                    res.render('login',{message:"Please verify your mail"});
                    
                }
                else{
                    req.session.user_id =userData._id;
                    const user= await Usern.findById({ _id: req.session.user_id });
                    const companyData=await Company.find();
                   
                    // return res.status(200).json({
                    //     message: "Login successful",
                    //     user: user,
                    //     company: companyData
                    // });
                    res.render('homePage', { user:user, company: companyData});
                    
                   
                }
            }
            else{
                // return res.status(200).json({
                //     message: "Password is incorrect",
                //     body: req.body // Send the request body back in the response
                // });
                res.render('login',{message:"Password is incorrect"});
                
            }
        }
        else{
            // return res.status(200).json({
            //     message: "Email is incorrect",
            //     body: req.body // Send the request body back in the response
               
            // });
            res.render('login',{message:"Email  is incorrect"});
            
        }
    
    }catch(error){
        console.log(error.message);
    }
}

const verifyForget = async(req,res)=>{
    try{
        const email=req.body.email;
        const userData=await User.findOne({email:email});
        if(userData){
            
            if(userData.is_verified===0){
                res.render('forget',{message:"Please verify your mail"});
            }else{
                const randomstring= randormstring.generate();
                console.log(randomstring);
                const updateToken=await User.updateOne({email:email},{$set:{token:randomstring}});
                console.log(updateToken);
                SendResetPWMail(userData.name,userData.email,randomstring);
                 res.render('forget',{message:"Reset link is send to your mail"});
            }
        }else{
            res.render('forget',{message:"User email is incorrrect"});
        }
    }
    catch(error){
        console.log(error.message);
    }
}
//to reset password
const SendResetPWMail =async(name,email,token)=>{
    try{
        const transporter= nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'yogesh1940.ac.in@gmail.com',
                pass:'psbs fkrk cxhf jurt'
            }
        });
        const mailOptions={
            from:'yogesh1940.ac.in@gmail.com',
            to:email,
            subject:'For Rest Password',
            html:'<p>Hii '+name+', please click here to <a href="http://localhost:3000/forget_pass?token='+token+'">Reset</a> your password.</p>'
        }

        transporter.sendMail(mailOptions ,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log('Email has been sent:',info.response);
            }
        })
    } catch(error) {
        console.log(error.message);
    }
}


// to use above created  to connect to post request in index.js file
module.exports ={
    loadRegister,
    insertUser,
    loadRegisterHome,
    verifyMail,
    loadRegisterLogin,
    verifyLogin,
    loadRegisterLogout,
    loadRegisterForget,
    verifyForget,
    SendResetPWMail,
    loadRegisterResetPW,
    ResetPassword,
    loadEditProfle,
    updateProfile,
    loadFirst,
    loadCompany,
    loadProfile,
    applyInCompany
    
}