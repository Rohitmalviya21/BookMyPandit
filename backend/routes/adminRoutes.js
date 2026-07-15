const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authmiddleware = require('../middleware/authmiddleware');
const adminMiddleware = require('../middleware/adminmiddlewere');

// All admin routes require both JWT authentication and admin role authorization
router.get('/stats', authmiddleware, adminMiddleware, adminController.getAdminStats);
router.get('/users', authmiddleware, adminMiddleware, adminController.getAllUsersForAdmin);
router.get('/pandits', authmiddleware, adminMiddleware, adminController.getAllPanditsForAdmin);
router.delete('/pandits/:id', authmiddleware, adminMiddleware, adminController.deletePanditByAdmin);
router.get('/bookings', authmiddleware, adminMiddleware, adminController.getAllBookingsForAdmin);
router.get('/contact-messages', authmiddleware, adminMiddleware, adminController.getAllContactMessages);
router.put('/contact-messages/:id/resolve', authmiddleware, adminMiddleware, adminController.resolveContactMessage);

module.exports = router;
