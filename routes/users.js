const express = require('express')
const { handleAuth, handleLogin, handleLogout, handlesendOtp, handleVerifyotp, handleForgetPassword } = require('../controllers/users')
const verifyAuth = require("../middleware/auth");


const router = express.Router()

router.get("/signup", (req, res) => {
    res.render("auth/signup");
});

router.get("/", (req, res) => {
    res.render("auth/login");
});

router.get("/forgot-password", (req, res) => {
    res.render("auth/forgot-password");
})

router.get("/verifyOtp", (req, res) => {
    return res.render("auth/verify-Otp", {
        email: req.query.email,
    });
});

router.get("/newPassword", (req, res) => {
    res.render("auth/forgetpassword", {
        email: req.query.email,
    })
})

router.post("/signup", handleAuth)

router.post("/", handleLogin)
router.post("/logout", handleLogout)
 
router.post("/sendOtp", handlesendOtp)

router.post("/verifyOtp", handleVerifyotp)
router.post("/newPassword", handleForgetPassword)



module.exports = router