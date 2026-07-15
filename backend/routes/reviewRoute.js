const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authmiddleware = require('../middleware/authmiddleware');

router.post('/create', authmiddleware, reviewController.createReview);
router.get('/pandit/:panditId', reviewController.getPanditReviews);

module.exports = router;
