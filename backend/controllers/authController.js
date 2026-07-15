const userSchema = require('./../model/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const register = async (req, res) => {

    const { name, email, contact, password, confirm_password, role } = req.body

    try {

        if (!name || !email || !contact || !password || !confirm_password) {
            return res.status(400).json({
                msg: "All fields are required"
            })
        }

        const userExist = await userSchema.findOne({ email })

        if (userExist) {
            return res.status(409).json({
                msg: "Email already exists"
            })
        }

        if (password !== confirm_password) {
            return res.status(400).json({
                msg: "Passwords do not match"
            })
        }

        const hashedpass = await bcrypt.hash(password, 10)

        const data = new userSchema({
            name,
            email,
            contact,
            password: hashedpass,
            role
        })

        const userCreated = await data.save()

        res.status(201).json({
            msg: "User registered successfully",
            userCreated
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            msg: "Internal server error"
        })
    }
}




const login = async (req, res) => {
    const { email, password, isAdminLogin } = req.body
    try {
        if (!email || !password) {
            return res.status(500).json({
                msg: "All fields are required"
            })
        }
        const userExist = await userSchema.findOne({ email })

        if (!userExist) {
            return res.status(500).json({
                msg: "you are not registered user"
            })
        }

        // Gate access logic
        if (userExist.role === 'admin' && !isAdminLogin) {
            return res.status(403).json({
                msg: "Admins must log in through the Admin Login portal"
            });
        }
        if (userExist.role !== 'admin' && isAdminLogin) {
            return res.status(403).json({
                msg: "Only admins are allowed to log in here"
            });
        }

        const planpassword = await bcrypt.compare(password, userExist.password)
        if (!planpassword) {
            return res.status(404).json({
                msg: "Email or Password is not valid"
            })
        }

        const token = jwt.sign({ id: userExist._id, email: userExist.email, role: userExist.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '24h'
        })

        res.status(200).json({
            msg: "You have logged in",
            token,

            user: {
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                role: userExist.role
            }
        })


    } catch (error) {
        res.status(400).json({
            msg: "internal error"
        })

    }
}


// send mail 
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
const ganrateOTP = () => {
    return crypto.randomInt(100000, 999999).toString()
}

const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userSchema.findOne({ email });

        if (!user) {
            return res.status(404).json({
                msg: "User Not Found"
            });
        }

        const otp = ganrateOTP();

        user.otp = otp;
        user.otpExpiry = Date.now() + 15 * 60 * 1000;
        user.isOtpVerified = false;

        await user.save();

        const mailOptions = {
            from: "malviyarohit196@gmail.com",
            to: user.email,
            subject: "Password Recovery",
            text: `Your OTP is ${otp}`
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            msg: "OTP Sent Successfully"
        });

    } catch (error) {
        return res.status(500).json({
            msg: error.message
        });
    }
};

// verify otp process
const verifyOTP = async (req, res) => {
    const { email, otp } = req.body
    try {
        const user = await userSchema.findOne({ email })
        if (!user) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }
        if (user.otp !== otp) {
            return res.status(404).json({
                msg: "Invalid OTP"
            })
        }

        const currentTime = Date.now()
        if (currentTime > user.otpExpiry) {
            return res.status(400).json({
                msg: 'OTP has Expired'
            })
        }
        user.otp = null
        user.otpExpiry = null
        user.isOtpVerified = true;
        await user.save()

        res.status(200).json({
            msg: "OTP verified successfully"
        })
    } catch (error) {
        res.status(500).json({
            msg: "please enter right otp"
        })
    }
}

const ResetPass = async (req, res) => {
    const { email, newPass, CPass } = req.body
    try {
        const user = await userSchema.findOne({ email })
        if (!user) {
            return res.status(404).json({
                msg: "User Not Found"
            })
        }

        if (!user.isOtpVerified) {
            return res.status(400).json({
                msg: 'OTP Verification Required'
            })
        }

        if (!newPass || !CPass) {
            return res.status(400).json({
                msg: "All fields are required"
            });
        }
        if (newPass !== CPass) {
            return res.status(400).json({
                msg: 'Password do not match'
            })
        }

        const HashedPass = await bcrypt.hash(newPass, 10)
        user.password = HashedPass

        user.otp = null
        user.otpExpiry = null
        user.isOtpVerified = false

        await user.save()
        res.status(200).json({
            msg: "Password Reset Sucessfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Server error"

        })

    }
}

const googleLogin = async (req, res) => {

    try {

        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                msg: 'Google token required'
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            email,
            name,
            picture
        } = payload;

        let user = await userSchema.findOne({ email });

        // New User
        if (!user) {

            const randomPassword =
                'GOOGLE_AUTH_' + Date.now();

            const hashedPass =
                await bcrypt.hash(
                    randomPassword,
                    10
                );

            user = await userSchema.create({
                name,
                email,
                image: picture,
                contact: '',
                password: hashedPass,
                role: 'user'
            });
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        );

        res.status(200).json({
            msg: 'Google login successful',
            token: jwtToken,
            role: user.role,
            name: user.name
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            msg: 'Google login failed'
        });
    }
};

module.exports = { register, login, sendOTP, verifyOTP, ResetPass,googleLogin }