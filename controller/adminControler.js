const User=require("../models/userModel");  //importing model created 
const Company=require("../models/companyModel");
const Usern =require("../models/usernModel");
const admin=require("../models/adminModel");
const bcrypt =require('bcrypt');
const express = require("express");
const nodemailer=require("nodemailer");
const randormstring = require('randomstring');
const exceljs=require('exceljs');

const securePassword=async(token)=>{
    try{
        const passwordHash =await bcrypt.hash(token,10);
        return passwordHash;
    }
    catch(error){
        console.log(error.message);
    }
}

// loding pages 

const loadRegisterHome = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        res.render('home', { user: user });
        }
    catch(error){
        console.log(error.message);
    }
}

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
        req.session.destroy();
        res.redirect('/first');
     }
    catch(error){
        console.log(error.message);
    }
}
const loadRegister = async(req,res)=>{
    try{
        res.render('registerA',{redirectFromVerifyMail: false});
     }
    catch(error){
        console.log(error.message);
    }
}

const loadRegisterProfile = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
       
        res.render('adminProfile', { user: user });
     }
    catch(error){
        console.log(error.message);
    }
}

const loadAdd_company = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        res.render('add_company',{user:user});
    }
    catch(error){
        console.log(error.message);
    }
}

const loadUsersList = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        var search='';
        if(req.query.search){
            search=req.query.search;
        }
        let page = parseInt(req.query.page) || 1; // Get the current page from the query parameter
        page = Math.max(1, page); // Ensure page is at least 1
        
        
        const limit=2;
        
        const userData=await Usern.find({
           
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
        })
        .limit(limit * 1)
        .skip((page-1)*limit)
        .exec();

        const count=await Usern.find({
            
            $or:[
                {name:{$regex:'.*'+search+'.*',$options:'i'}},
                {email:{$regex:'.*'+search+'.*',$options:'i'}}
            ]
        }).countDocuments();

        res.render('usersList',{
            usern:userData,
            user:user,
            totalPages:Math.ceil(count/limit),
            currentPage: page,
            nextPage: (page < Math.ceil(count/limit)) ? (page + 1) : null,
                previousPage: (page > 1) ? (page - 1) : null
        });
    }
    catch(error){
        console.log(error.message);
    }
}


const loadEditUser = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        const idd= req.query.idd;
        const userData=await Usern.findById({_id:idd});
        if(userData){
            res.render('edit_user',{usern:userData,user:user});
        }else{
            res.redirect('/admin/home')
        }    
    }
    catch(error){
        console.log(error.message);
    }
}
const loadUpdateAdmin = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        if(user){
            res.render('edit_admin',{user:user});
        }else{
            res.redirect('/admin/home')
        }    
    }
    catch(error){
        console.log(error.message);
    }
}
const loadCompanyDetails = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        const idd= req.query.idd;
        const userData=await Company.findById({_id:idd});
        if(userData){
            res.render('companyDetails',{Company:userData,user:user});
        }else{
            res.redirect('/admin/home')
        }    
    }
    catch(error){
        console.log(error.message);
    }
}

const studentsApplied = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        const idd= req.query.idd;
        const userData=await Company.findById({_id:idd});
        const stdData = await Usern.find({ regNum: { $in: userData.rollNumbers } });        if(userData){
            res.render('appliedStudens',{Company:userData,user:user,student:stdData});
        }else{
            res.redirect('/admin/home')
        }    
    }
    catch(error){
        console.log(error.message);
    }
}


const loadCompanyList = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        const userData=await Company.find();
        const userT=await admin.find();
        if(userT){
        res.render('companyList',{Company:userData,is_admin:true,user:user});}
        else{
            res.render('companyList',{Company:userData,is_admin:false});}
        
    }
    catch(error){
        console.log(error.message);
    }
}
const delete_user = async(req,res)=>{
    try{
        const id= req.query.id;
        const user= await admin.findById({_id:id});
        const idd=req.query.idd;
        const userData=await Company.deleteOne({_id:idd});
        const userDataNew=await Company.find();
        res.render('companyList',{user:user,Company:userDataNew});
    }
    catch(error){
        console.log(error.message);
    }
}

//update user
const updateUser = async (req, res) => {
    try {
        const id = req.body.admin_id;
        const user = await admin.findById({ _id: id });
        const userData = await Usern.findByIdAndUpdate(
            { _id: req.body.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    regNum: req.body.regNum,
                    cgpa: req.body.cgpa,
                    status: req.body.status
                }
            }
        );
        const newUserData = await Usern.find();

        // Redirect back to userList page with page number
        res.redirect(`/admin/usersList?id=${id}&page=${req.query.page || 1}`);
    } catch (error) {
        console.log(error.message);
    }
}

const updateAdmin = async (req, res) => {
    try {
        
        const spassword =await securePassword(req.body.password);
        
        if(req.file){
            const userData= await admin.findByIdAndUpdate({_id:req.body.iddd},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile,image:req.file.filename}})
        }else{
         const userData= await admin.findByIdAndUpdate({_id:req.body.iddd},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile}});
        }
        const idd=req.body.iddd;
        const usern = await admin.findById({ _id: idd });
        res.render('adminProfile',{user:usern});
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}


//verify login
const verifyLogin = async(req,res)=>{
    try{
        const email=req.body.email.toString();
        const password=req.body.password;

        const userData=await admin.findOne({ email:email });
        //console.log(userData);
        if(userData){
            const passwordMatch=await bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_admin===0){
                    res.render('login',{message:"Email or password incorrect"});
                }
                else{
                    req.session.user_id =userData._id;
                    const user= await admin.findById({ _id: req.session.user_id });
                    res.render('home', { user: user });
                   
                }
            }
            else{
                res.render('login',{message:"Password is incorrect"});
            }
        }
        else{
            res.render('login',{message:"Email  is incorrect"});
        }
     }
    catch(error){
        console.log(error.message);
    }
}


//Export users
const exportUsers=async(teq,res)=>{
    try{
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("My Users");
        worksheet.columns = [
            {header:"s_no.",key:"s_no"},
            {header:"Name",key:"name"},
            {header:"Email",key:"email"},
            {header:"Mobile",key:"mobile"},
            {header:"Image",key:"image"},
            {header:"is verified",key:"is_verified"}

            
        ];
        let counter=1;
        const userData=await Usern.find();
        userData.forEach((user)=> {
            user.s_no = counter;
            worksheet.addRow(user);
            counter++; 
        });
            worksheet.addRow(1).eachCell((cell)=>{
                cell.font ={bold:true};
            });         
       res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats.officedocument.spreadsheatml.sheet"
       );
       res.setHeader("Content-Disposition",`attachment; filename=users.xlsx`);
       return workbook.xlsx.write(res).then(()=>{
        res.status(200);
       });
    }catch(error){
        console.log(error.message)
    }
}

const exportAppliedStud=async(req,res)=>{
    try{
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet("My Users");
        worksheet.columns = [
            {header:"s_no.",key:"s_no"},
            {header:"Name",key:"name"},
            {header:"Roll Num",key:"regNum"},
            {header:"CGPA",key:"cgpa"},
            {header:"Branch",key:"branch"}
          

            
        ];
        let counter=1;
        
        const idd= req.query.idd;
        const userData=await Company.findById({_id:idd});
        const stdData = await Usern.find({ regNum: { $in: userData.rollNumbers } }); 

        stdData.forEach((user)=> {
            user.s_no = counter;
            worksheet.addRow(user);
            counter++; 
        });
            worksheet.addRow(1).eachCell((cell)=>{
                cell.font ={bold:true};
            });         
       res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats.officedocument.spreadsheatml.sheet"
       );
       res.setHeader("Content-Disposition",`attachment; filename=users.xlsx`);
       return workbook.xlsx.write(res).then(()=>{
        res.status(200);
       });
    }catch(error){
        console.log(error.message)
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
            html:'<p>Hii '+name+', please click here to <a href="http://localhost:3000/admin/verifyA?id='+user_id+'">verify</a> your mail.</p><br><b>Email:<b>'+email+'<br></b>Id:</b>'+user_id+''
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
const Add_company =async(req,res)=>{
    try{
        const id = req.query.id;
        const usern = await admin.findById({ _id: id });
        const user = new Company({
            name:req.body.name,
            companyId:req.body.companyId,
            cgpa:req.body.cgpa,
            branch:req.body.branch,
            description:req.body.description,
            regDate:req.body.regDate,
            intrDate:req.body.intrDate,
            totalReq:req.body.totalReq,
            file:req.file.filename,

           
        });
        const userData = await user.save();
        if(userData){
            res.render('add_company',{message:"Registeration successfull",user:usern});
        }
        else{
            res.render('add_company',{message:"Registeratio  failed"});
        }
    }
    catch(error){
        console.log(error.message);
    }
}

const insertUser =async(req,res)=>{
    try{
        const token='12345';
        const spassword =await securePassword(token);
        const user = new admin({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
           
            gender:req.body.gender,
            image:req.file.filename,
            password:spassword,
            main_admin:0,

        });
        const userData = await user.save();
        if (userData) {
            SendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registerA', { message: "Registration successful, <br> please verify your email and then login into your account ", success: true ,redirectFromVerifyMail: true});
        } else {
            res.render('registerA', { message: "Registration failed", success: false ,redirectFromVerifyMail: true });
        }
        
        
    }
    catch(error){
        console.log(error.message);
    }
}

const verifyMail=async(req,res)=>{
    try{
        const updateInfo=await admin.updateOne({_id:req.query.id},{ $set:{ is_verified:1 }});
        console.log(updateInfo);
        res.render("verify");

    }catch(error){
        console.log(error.message)
    }
}

module.exports ={
    loadRegisterHome,
    loadRegisterLogin,
    loadRegisterLogout,
    verifyLogin,
  
    loadUsersList,
    exportUsers,
    loadAdd_company,
    Add_company,
    loadCompanyList,
    loadEditUser,
    updateUser,
    loadRegisterProfile,
    delete_user,
    loadCompanyDetails,
    insertUser,
    loadRegister,
    verifyMail,
    updateAdmin,
    loadUpdateAdmin,
    studentsApplied,
    exportAppliedStud
}