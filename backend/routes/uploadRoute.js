const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
    '/image',
    authMiddleware,
    upload.single('image'),
    (req, res) => {

        if (!req.file) {
            return res.status(400).json({
                msg: 'No file uploaded'
            });
        }

        res.status(200).json({
            image: req.file.filename
        });
    }
);

module.exports = router;