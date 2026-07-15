const express = require('express')

const router = express.Router()

const bookingController = require('./../controllers/bookingController')

const authmiddleware = require('../middleware/authmiddleware')

router.post('/create',authmiddleware,bookingController.createBooking)
router.get('/my-bookings',authmiddleware,bookingController.getMyBooking)
router.get('/pandit-bookings',authmiddleware,bookingController.getPanditBookings)
router.put('/status/:id',authmiddleware,bookingController.updateBookingStatus)
router.put('/complete/:id',authmiddleware,bookingController.completeBooking)
router.put('/cancel/:id', authmiddleware, bookingController.cancelBookingByUser)
router.get('/pandit-dashboard',authmiddleware,bookingController.panditDashboardStats)
router.get('/recent-bookings',authmiddleware,bookingController.recentBooking)
router.get('/user-dashboard',authmiddleware,bookingController.userDashboaredstatus)
router.get('/booked-dates/:panditId', bookingController.getBookedDates)

module.exports = router