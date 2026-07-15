const User = require('../model/userSchema');
const Pandit = require('../model/panditSchema');
const Booking = require('../model/bookingSchema');
const Contact = require('../model/contactSchema');

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalPandits = await Pandit.countDocuments();
        const totalBookings = await Booking.countDocuments();
        
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const acceptedBookings = await Booking.countDocuments({ status: 'accepted' });
        const completedBookings = await Booking.countDocuments({ status: 'completed' });
        const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
        
        const totalContactMessages = await Contact.countDocuments();
        const pendingContactMessages = await Contact.countDocuments({ status: 'pending' });

        res.status(200).json({
            totalUsers,
            totalPandits,
            totalBookings,
            pendingBookings,
            acceptedBookings,
            completedBookings,
            cancelledBookings,
            totalContactMessages,
            pendingContactMessages
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const getAllUsersForAdmin = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password');
        res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const getAllPanditsForAdmin = async (req, res) => {
    try {
        const pandits = await Pandit.find().populate('userId', 'name email contact');
        res.status(200).json({ pandits });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const getAllBookingsForAdmin = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email contact')
            .populate({
                path: 'panditId',
                populate: {
                    path: 'userId',
                    select: 'name email contact'
                }
            });
        res.status(200).json({ bookings });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const deletePanditByAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const pandit = await Pandit.findById(id);
        if (!pandit) {
            return res.status(404).json({ msg: 'Pandit not found' });
        }

        // Reset the role of the user associated with this Pandit profile to 'user'
        await User.findByIdAndUpdate(pandit.userId, { role: 'user' });
        
        // Delete the Pandit profile document
        await Pandit.findByIdAndDelete(id);

        res.status(200).json({ msg: 'Pandit removed successfully and role reset to user' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const getAllContactMessages = async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ contacts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const resolveContactMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
        if (!contact) {
            return res.status(404).json({ msg: 'Contact message not found' });
        }
        res.status(200).json({ msg: 'Message marked as resolved', contact });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = {
    getAdminStats,
    getAllUsersForAdmin,
    getAllPanditsForAdmin,
    getAllBookingsForAdmin,
    deletePanditByAdmin,
    getAllContactMessages,
    resolveContactMessage
};
