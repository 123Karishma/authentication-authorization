const User = require("../models/users")
const jwt = require('jsonwebtoken')
const argon2 = require('argon2');
const nodemailer = require('nodemailer')



const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.SMTP_PASSWORD,
    },

});

async function handleAuth(req, res) {
    const { name, email, password } = req.body
    console.log("req.body", req.body)

    if (!name || !email || !password) {
        return res.send("all feilds are required")
    }
    const Useremail = req.body.email.toLowerCase().trim()
    const existEmail = await User.findOne({ email: Useremail })
    if (existEmail) {
        return res.json({ message: "email already exists" })

    }
    const hashedPassword = await argon2.hash(password);
    await User.create({
        name,
        email,
        password: hashedPassword
    })
    return res.redirect("/home")
}



async function handleLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.send("Invalid email or password");
    }

    const isPasswordValid = await argon2.verify(
        user.password,
        password
    );

    if (!isPasswordValid) {
        return res.send("Invalid email or password");
    }

    const payload = {
        id: user._id,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.SECERATE_KEY);

    res.cookie("token", token, {
        httpOnly: true,
    });

    return res.redirect("/home");
}


async function handleLogout(req, res) {
    res.clearCookie("token", {
        httpOnly: true,
    });

    return res.redirect("/")

}





async function handlesendOtp(req, res) {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
        res.status(404).json({ message: "user not found" })
    }

    const otp = Math.floor(
        100000 + Math.random() * 900000
    );

    user.resendOp = otp
    user.expiryOtp = Date.now() + 4 * 60 * 1000
    await user.save()

    console.log("EMAIL_USER =", process.env.EMAIL_USER);
    console.log("EMAIL_PASS =", process.env.SMTP_PASSWORD);
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "OTP for password reset",
        text: `Your otp is ${otp}`,
    });
    // await transporter.sendMail({ mailsend })


    // if (!user) {
    return res.redirect(`/verifyOtp?email=${email}`);
    //     return res.status(404).json({
    //         message: "User not found"
    //     });
    // }
}

async function handleVerifyotp(req, res) {
    try {
        const { email, otp } = req.body
        console.log("req.body", req.body)
        const user = await User.findOne({ email });
        console.log("user", user)

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.resendOp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        if (user.expiryOtp < Date.now()) {
            return res.status(400).json({
                message: "OTP Expired",
            });
        }

        return res.redirect(`/newPassword?email=${email}`);

    } catch (error) {
        console.log(error)

    }

}

async function handleForgetPassword(req, res) {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        console.log("req.body =", req.body);

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "New Password and Confirm Password not same",
            });
        }

        const hashedPassword = await argon2.hash(newPassword);

        user.password = hashedPassword;

        await user.save();

        return res.redirect("/");

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}

module.exports = {
    handleAuth,
    handleLogin,
    handleLogout,
    handlesendOtp,
    handleVerifyotp,
    handleForgetPassword
}