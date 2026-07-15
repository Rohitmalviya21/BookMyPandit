const express = require('express')
const router = express.Router()

const userController = require('./../controllers/userController')
const authmiddleware = require('../middleware/authmiddleware')
const upload = require('../middleware/upload')


router.get('/my-profile', authmiddleware, userController.getMyProfile)
router.put('/update-profile', authmiddleware, upload.single('image'), userController.updateMyProfile)
router.put('/change-password', authmiddleware, userController.changePassword)

module.exports = router