const express =require("express");
const admin_route = express();

const session =require("express-session");
const config =require("../configg/adminConfig");
admin_route.use(session({secret:config.sessionSecret}));
const auth = require('../middleware/adminAuth');

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));
const multer =require('multer');
const path =require("path");
admin_route.use(express.static('public'));


const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null ,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name =Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload =multer({storage:storage});

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const adminControler =require("../controller/adminControler");



admin_route.get('/login' ,auth.is_Logout,adminControler.loadRegisterLogin);
admin_route.post('/login',adminControler.verifyLogin);
admin_route.get('/home',auth.is_Login,adminControler.loadRegisterHome);
admin_route.get('/logout',adminControler.loadRegisterLogout);
// admin_route.get('/forget' ,auth.is_Logout,adminControler.loadRegisterForget);
// admin_route.post('/forget',adminControler.verifyForget);
// admin_route.get('/forget_pass' ,adminControler.loadRegisterResetPW);
// admin_route.post('/forget_pass',adminControler.ResetPassword);
admin_route.get('/usersList',adminControler.loadUsersList);
admin_route.get('/companyList',adminControler.loadCompanyList);
admin_route.get('/export_users',adminControler.exportUsers);
admin_route.get('/export_applied_std',adminControler.exportAppliedStud);
admin_route.get('/add_company',adminControler.loadAdd_company);
admin_route.post('/add_company',upload.single('file'),adminControler.Add_company);
admin_route.get('/edit_user',auth.is_Login,adminControler.loadEditUser);
admin_route.post('/edit_user',adminControler.updateUser);
admin_route.get('/edit_admin',auth.is_Login,adminControler.loadUpdateAdmin);
admin_route.post('/edit_admin',upload.single('image'),adminControler.updateAdmin);
admin_route.get('/profile',adminControler.loadRegisterProfile);
admin_route.get('/delete_user',adminControler.delete_user);
admin_route.get('/companyDetails',adminControler.loadCompanyDetails);
admin_route.get('/appliedStudens',adminControler.studentsApplied);
admin_route.get('/registerA',adminControler.loadRegister);
admin_route.post('/registerA',upload.single('image'),adminControler.insertUser);
admin_route.get('/verifyA',adminControler.verifyMail);



module.exports =admin_route;