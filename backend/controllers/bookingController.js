const Booking = require('../model/bookingSchema')
const Pandit = require('../model/panditSchema')

const createBooking = async (req, res) => {
    try {
        const { panditId, poojaType, date, address } = req.body

        if (!panditId || !poojaType || !date || !address) {
            return res.status(400).json({
                msg: 'All fields are required'
            })
        }

        // Split the requested dates (could be single or comma-separated)
        const requestedDates = date.split(',').map(d => d.trim());

        const activeBookings = await Booking.find({
            panditId,
            status: { $in: ['pending', 'accepted'] }
        });

        for (const booking of activeBookings) {
            if (booking.date) {
                const bookedDates = booking.date.split(',').map(d => d.trim());
                const overlap = requestedDates.some(rd => bookedDates.includes(rd));
                if (overlap) {
                    return res.status(409).json({
                        msg: 'This pandit already has a booking on one or more of the selected dates. Please choose a different date.'
                    });
                }
            }
        }

        const booking = new Booking({
            userId: req.user.id,
            panditId,
            poojaType,
            date,
            address
        })
        await booking.save()

        res.status(201).json({
            msg: "Booking create successfully",
            booking
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Internal server error"
        })
    }
}


const getMyBooking = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).populate({
            path: 'panditId',
            populate: {
                path: 'userId',
                select: 'name contact'
            }
        })

        const Review = require('../model/reviewSchema')
        const bookingIds = bookings.map(b => b._id)
        const userReviews = await Review.find({ bookingId: { $in: bookingIds } })
        const reviewedBookingIds = new Set(userReviews.map(r => r.bookingId.toString()))

        const bookingsWithReviewFlag = bookings.map(booking => {
            const bookingObj = booking.toObject()
            bookingObj.hasReview = reviewedBookingIds.has(bookingObj._id.toString())
            return bookingObj
        })

        res.status(200).json({
            bookings: bookingsWithReviewFlag
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const getPanditBookings = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ userId: req.user.id })

        if (!pandit) {
            return res.status(404).json({
                msg: "Pandit Profile not found"
            })
        }

        const bookings = await Booking.find({
            panditId: pandit._id
        }).populate('userId', 'name email contact')

        res.status(200).json({
            bookings
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params
        const { status } = req.body

        const allowedStatuses = ['accepted', 'cancelled']
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                msg: 'Invalid status. Only accepted or cancelled allowed here.'
            })
        }

        const booking = await Booking.findById(id)
        if (!booking) {
            return res.status(404).json({
                msg: 'Booking not found'
            })
        }

        const pandit = await Pandit.findOne({ userId: req.user.id })
        if (!pandit || booking.panditId.toString() !== pandit._id.toString()) {
            return res.status(403).json({
                msg: 'You are not authorized to update this booking'
            })
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({
                msg: `Cannot change status. Booking is already ${booking.status}`
            })
        }

        booking.status = status
        await booking.save()

        res.status(200).json({
            msg: 'Booking status updated',
            booking
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const completeBooking = async (req, res) => {
    try {
        const { id } = req.params

        const booking = await Booking.findById(id)
        if (!booking) {
            return res.status(404).json({
                msg: 'Booking not found'
            })
        }

        const pandit = await Pandit.findOne({ userId: req.user.id })
        if (!pandit || booking.panditId.toString() !== pandit._id.toString()) {
            return res.status(403).json({
                msg: 'You are not authorized to update this booking'
            })
        }

        if (booking.status !== 'accepted') {
            return res.status(400).json({
                msg: 'Only accepted bookings can be marked as completed'
            })
        }

        booking.status = 'completed'
        await booking.save()

        res.status(200).json({
            msg: 'Booking marked as completed',
            booking
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}


const panditDashboardStats = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ userId: req.user.id })
        if (!pandit) {
            return res.status(404).json({
                msg: "Pandit Profile not found"
            })
        }
        const totalRequests = await Booking.countDocuments({ panditId: pandit._id })
        const acceptedBooking = await Booking.countDocuments({ panditId: pandit._id, status: 'accepted' })
        const pendingBooking = await Booking.countDocuments({ panditId: pandit._id, status: 'pending' })
        const cancelledBooking = await Booking.countDocuments({ panditId: pandit._id, status: 'cancelled' })
        res.status(200).json({ totalRequests, acceptedBooking, pendingBooking, cancelledBooking })

    } catch (error) {
        console.log(error)

        res.status(500).json({

            msg: 'Internal server error'
        })

    }
}

const recentBooking = async (req, res) => {
    try {

        // Login pandit find karna
        const pandit = await Pandit.findOne({ userId: req.user.id })

        // Agar pandit profile nahi mili
        if (!pandit) {
            return res.status(404).json({
                msg: 'Pandit profile not found'
            })
        }

        // Recent 5 bookings nikalna
        const bookings = await Booking.find({ panditId: pandit._id })
            .populate('userId', 'name contact')
            .sort({ createdAt: -1 })
            .limit(5)

        // Response bhejna
        res.status(200).json({
            bookings
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const userDashboaredstatus = async(req,res) =>{
    try {
         const totalbookings = await Booking.countDocuments({userId:req.user.id})
         const compleatedbookings = await Booking.countDocuments({userId:req.user.id,status:'completed'})
         const pandingbookings = await Booking.countDocuments({userId:req.user.id,status:'pending'})

         res.status(200).json({
            totalbookings,
            compleatedbookings,
            pandingbookings
         })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg:'Internal server error'
        })
    }
}

const cancelBookingByUser = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({
                msg: 'Booking not found'
            });
        }

        // Authorization check: Verify user ownership of the booking
        if (booking.userId.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                msg: 'You are not authorized to cancel this booking'
            });
        }

        // State check: A user can only cancel pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({
                msg: `Cannot cancel. Booking is already ${booking.status}. Please contact the pandit directly.`
            });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            msg: 'Booking cancelled successfully',
            booking
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getBookedDates = async (req, res) => {
    try {
        const { panditId } = req.params;
        const bookings = await Booking.find({
            panditId,
            status: { $in: ['pending', 'accepted'] }
        }).select('date');

        // Flatten comma-separated dates into a single list
        const dates = [];
        bookings.forEach(b => {
            if (b.date) {
                b.date.split(',').forEach(d => {
                    if (d.trim()) {
                        dates.push(d.trim());
                    }
                });
            }
        });

        res.status(200).json({ bookedDates: dates });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = { createBooking, getMyBooking, getPanditBookings, updateBookingStatus, panditDashboardStats,recentBooking ,userDashboaredstatus, completeBooking, cancelBookingByUser, getBookedDates}