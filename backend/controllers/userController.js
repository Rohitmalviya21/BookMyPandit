const userSchema = require('./../model/userSchema')
const bcrypt = require('bcrypt')

const getMyProfile = async (req, res) => {
    try {
        const user = await userSchema.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(404).json({
                msg: 'User not Found'
            })
        }
        res.status(200).json({
            user
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: 'Internal server error'
        });
    }
}

const updateMyProfile = async (req, res) => {
    try {
        const { name, contact } = req.body

        const updateData = { name, contact }

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const updateUser = await userSchema.findByIdAndUpdate(req.user.id,
            updateData,
            { new: true }
        ).select('-password')

        if (!updateUser) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        res.status(200).json({
            msg: "Profile updated successfully",
            user: updateUser
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            msg: "Unable to update profile"
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                msg: "All password fields are required"
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                msg: "New passwords do not match"
            });
        }

        const user = await userSchema.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                msg: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                msg: "Incorrect current password"
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.status(200).json({
            msg: "Password updated successfully"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Unable to change password"
        });
    }
};

module.exports = { getMyProfile, updateMyProfile, changePassword }