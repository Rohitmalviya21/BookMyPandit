const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Review = require('../model/reviewSchema');
const Booking = require('../model/bookingSchema');
const Pandit = require('../model/panditSchema');

const MONGO_URI = process.env.MONGO_URI;

const cleanupReviews = async () => {
    if (!MONGO_URI) {
        console.error("CRITICAL ERROR: MONGO_URI environment variable is not defined in .env file.");
        process.exit(1);
    }

    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGO_URI);
        console.log("Database connected successfully.");

        // Fetch all reviews
        const reviews = await Review.find({});
        console.log(`Found ${reviews.length} total reviews.`);

        const validReviews = [];
        const invalidReviews = [];

        for (const review of reviews) {
            const booking = await Booking.findById(review.bookingId);
            
            let isInvalid = false;
            let reason = "";

            if (!booking) {
                isInvalid = true;
                reason = "Booking does not exist";
            } else if (booking.status !== 'completed') {
                isInvalid = true;
                reason = `Booking status is '${booking.status}' (expected 'completed')`;
            } else if (booking.userId.toString() !== review.userId.toString()) {
                isInvalid = true;
                reason = "User ownership mismatch";
            }

            if (isInvalid) {
                invalidReviews.push({
                    review,
                    reason
                });
            } else {
                validReviews.push(review);
            }
        }

        console.log("\n--- DRY-RUN SUMMARY REPORT ---");
        console.log(`Total Reviews Checked: ${reviews.length}`);
        console.log(`Valid Reviews: ${validReviews.length}`);
        console.log(`Invalid/Fake Reviews: ${invalidReviews.length}`);

        if (invalidReviews.length > 0) {
            console.log("\nInvalid Reviews Identified:");
            invalidReviews.forEach((item, index) => {
                const { review, reason } = item;
                console.log(`[${index + 1}] ID: ${review._id} | Pandit ID: ${review.panditId} | Rating: ${review.rating} | Reason: ${reason}`);
            });
        } else {
            console.log("\nNo invalid reviews found.");
        }

        const confirmFlag = process.argv.includes('--confirm');

        if (confirmFlag) {
            if (invalidReviews.length > 0) {
                console.log("\nDeleting invalid reviews...");
                const invalidIds = invalidReviews.map(item => item.review._id);
                const deleteResult = await Review.deleteMany({ _id: { $in: invalidIds } });
                console.log(`Successfully deleted ${deleteResult.deletedCount} reviews.`);
            }

            console.log("\nRecalculating ratings for all Pandits...");
            const pandits = await Pandit.find({});
            let updatedCount = 0;

            for (const pandit of pandits) {
                const stats = await Review.aggregate([
                    { $match: { panditId: pandit._id } },
                    { $group: { _id: '$panditId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
                ]);

                if (stats.length > 0) {
                    await Pandit.findByIdAndUpdate(pandit._id, {
                        averageRating: Math.round(stats[0].avgRating * 10) / 10,
                        totalReviews: stats[0].count
                    });
                } else {
                    await Pandit.findByIdAndUpdate(pandit._id, {
                        averageRating: 0,
                        totalReviews: 0
                    });
                }
                updatedCount++;
            }

            console.log(`Successfully recalculated and updated rating stats for all ${updatedCount} Pandits.`);
        } else {
            console.log("\nSAFEGUARD WARNING: Running in DRY-RUN mode. No deletions were performed.");
            console.log("To confirm deletion and recalculate ratings, run the script with the '--confirm' flag:");
            console.log("npm run cleanup:reviews -- --confirm");
        }

    } catch (error) {
        console.error("An error occurred during execution:", error);
    } finally {
        console.log("Disconnecting from database...");
        await mongoose.disconnect();
        console.log("Database connection closed.");
        process.exit(0);
    }
};

cleanupReviews();
