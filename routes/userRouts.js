const express = require("express");
const user_route = express();

const session = require("express-session");
const config = require("../configg/config");
user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
  })
);

const auth = require("../middleware/auth");

const bodyParser = require("body-parser");
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/userImages"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });

user_route.set("view engine", "ejs");
user_route.set("views", "./views/users");

const userControler = require("../controller/userControler");

user_route.get("/first", userControler.loadFirst);
user_route.get("/home", auth.isLogin, userControler.loadRegisterHome);
user_route.get("/register", auth.isLogout, userControler.loadRegister);
user_route.post("/register", upload.single("image"), userControler.insertUser);
user_route.get("/verify", userControler.verifyMail);
user_route.get("/login", auth.isLogout, userControler.loadRegisterLogin);
user_route.post("/login", userControler.verifyLogin);
user_route.get("/logout", auth.isLogin, userControler.loadRegisterLogout);
user_route.get("/forget", auth.isLogout, userControler.loadRegisterForget);
user_route.post("/forget", userControler.verifyForget);
user_route.get("/forget_pass", userControler.loadRegisterResetPW);
user_route.post("/forget_pass", userControler.ResetPassword);
user_route.get("/edit", auth.isLogin, userControler.loadEditProfle);
user_route.post("/edit", upload.single("image"), userControler.updateProfile);
user_route.get("/company", auth.isLogin, userControler.loadCompany);
user_route.get("/apply_comp", auth.isLogin, userControler.applyInCompany);
user_route.get("/profile", userControler.loadProfile);

module.exports = user_route;
