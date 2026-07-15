const express = require('express')

const router = express.Router()

const panditController =
require('../controllers/panditController')
const authmiddleware = require('../middleware/authmiddleware')
const { route } = require('./bookingRoute')
const upload = require('../middleware/upload')

router.get('/all',panditController.getAllPandit)
router.get('/search',panditController.searchPandit)
router.get('/check-profile',authMiddleware,panditController.checkPanditProfile)
router.get ('/my-profile',authMiddleware,panditController.getMyProfile)

router.post('/add',authMiddleware,upload.single('image'), panditController.addPandit)
router.put('/update-profile',authMiddleware,upload.single('image'),panditController.updateProfile)
router.get('/:id',panditController.singlePandit)



module.exports = router