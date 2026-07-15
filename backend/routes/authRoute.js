const express = require ('express')

const router = express.Router()
const authcontroller = require('./../controllers/authController')

router.post('/register',(authcontroller.register))
router.post('/login',(authcontroller.login))
router.post('/send-otp',(authcontroller.sendOTP))
router.post('/verify-otp',(authcontroller.verifyOTP))
router.post('/reset-password',(authcontroller.ResetPass))
router.post('/google',(authcontroller.googleLogin))
    

module.exports = router