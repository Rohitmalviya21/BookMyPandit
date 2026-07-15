const express = require('express')

const router = express.Router()

const contactController = require('../controllers/contactController')
const authMiddleware = require('../middleware/authmiddleware')

router.post('/',authMiddleware,contactController.createContact)

module.exports = router