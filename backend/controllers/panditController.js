const Pandit = require('./../model/panditSchema')
const User = require('./../model/userSchema')
const jwt = require('jsonwebtoken')

const addPandit = async (req, res) => {
    try {
        const { specialization, experience, location, fees, bio } = req.body
        const image = req.file ? req.file.filename :''


        if (!specialization || !experience || !location || !fees) {
            return res.status(400).json({
                msg: "All filed are required"
            })
        }

        const exisitngPandit = await Pandit.findOne({ userId: req.user.id })
        if (exisitngPandit) {
            return res.status(400).json({
                msg: "pandit profile already exists"
            })
        }
        const pandit = new Pandit({
            userId: req.user.id,
            specialization,
            experience,
            location,
            fees,
            bio,
            image
        })

        await pandit.save()

        // Update user role in User collection to 'pandit'
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { role: 'pandit' }, { new: true })

        // Sign new token with upgraded role
        const token = jwt.sign(
            { id: updatedUser._id, email: updatedUser.email, role: updatedUser.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '24h' }
        )

        res.status(201).json({
            msg: "Pandit Profile created", 
            pandit,
            token,
            role: updatedUser.role
        })
    } catch (error) {

        console.log(error)

        res.status(500).json({
            msg: "Internal server error"
        })
    }
}

const getAllPandit = async (req, res) => {
    try {
        const pandits = await Pandit.find().sort({ averageRating: -1 }).populate(
            'userId',
            'name email contact'
        )
        res.status(200).json({
            pandits
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: "Internal server error"
        })

    }
}

const singlePandit = async (req, res) => {

    try {

        const { id } = req.params

        const pandit = await Pandit.findById(id)
            .populate(
                'userId',
                'name email contact'
            )

        if (!pandit) {

            return res.status(404).json({
                msg: "Pandit not found"
            })
        }

        res.status(200).json({
            pandit
        })

    } catch (error) {

        console.log(error)

        res.status(500).json({
            msg: 'Internal server error'
        })
    }
}

const checkPanditProfile = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ userId: req.user.id });

        if (pandit) {
            return res.status(200).json({
                exists: true,
                pandit
            });
        }

        res.status(200).json({ exists: false });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

const updateProfile = async (req, res) => {
    try {

        const {
            specialization,
            experience,
            location,
            fees,
            bio
        } = req.body;

        const updateData = {
            specialization,
            experience,
            location,
            fees,
            bio
        };

        // Agar new image upload hui hai
        if (req.file) {
            updateData.image = req.file.filename;
        }

        const profileupdate =
            await Pandit.findOneAndUpdate(
                { userId: req.user.id },
                updateData,
                { new: true }
            );

        if (!profileupdate) {
            return res.status(404).json({
                msg: 'cannot update profile'
            });
        }

        res.status(200).json({
            msg: 'Profile updated successfully',
            pandit: profileupdate
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            msg: 'Internal server error'
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const pandit = await Pandit.findOne({ userId: req.user.id })
        if (!pandit) {
            return res.status(404).json({
                msg: "Pandit Profile not found"
            })
        }
        res.status(200).json({
            pandit
        })

    } catch (error) {
        console.log(error)

        res.status(500).json({

            msg: 'Internal server error'
        })
    }
}


const searchPandit = async (req, res) => {
    try {
        const search = req.query.search
        const pandits = await Pandit.find({
            $text: {
                $search: search
            }
        }).sort({ averageRating: -1 }).populate(
            'userId',
            'name contact'
        )

        res.status(200).json({ pandits })
    } catch (error) {
        console.log(error)

        res.status(500).json({

            msg: 'Internal server error'
        })
    }
}

module.exports = { addPandit, getAllPandit, singlePandit, checkPanditProfile, updateProfile, getMyProfile ,searchPandit}