import Gig from "../models/gigModel.js"
import User from "../models/userModel.js"
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Features from "../utils/features.js";

// Create gig
export const createGig = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;

    const gig = await Gig.create(req.body);

    res.status(201).json({
        success: true,
        message: "sucessfully created your gig",
        gig
    })
})

// Get all gigs
export const getAllGigs = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 10;
    const gigsCount = await Gig.countDocuments();

    const feature = new Features(Gig.find().populate("user", "name"), req.query).search().filter().pagination(resultPerPage).populate();
    const gigs = await feature.query;

    res.status(200).json({
        success: true,
        message: "successfully fetched all gigs from database",
        gigsCount,
        gigs
    })
})

// Get gig details
export const getGig = catchAsyncErrors(async (req, res, next) => {

    const gig = await Gig.findById(req.params.id).populate("user", "name avatar numOfRatings ratings userSince country description tagline");

    if (!gig) {
        return next(new ErrorHandler("Gig not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Gig found sucessfully",
        gig
    })
})

// Update gig
export const updateGig = catchAsyncErrors(async (req, res, next) => {

    let gig = await Gig.findById(req.params.id);

    if (!gig) {
        return next(new ErrorHandler("Gig not found", 404));
    }

    gig = await Gig.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindandModify: false
    })

    res.status(200).json({
        success: true,
        message: "Gig updated sucessfully",
        gig
    })
})

// Delete gig
export const deleteGig = catchAsyncErrors(async (req, res, next) => {

    const gig = await Gig.findById(req.params.id);

    if (!gig) {
        return next(new ErrorHandler("Gig not found", 404));
    }

    await gig.remove();

    res.status(200).json({
        success: true,
        message: "Gig deleted sucessfully"
    })
})


// Create gig review
export const createGigReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, gigId } = req.body;
    console.log(req.user.country);
    const review = {
        user: req.user._id,
        name: req.user.name,
        avatar: req.user.avatar,
        country: req.user.country,
        rating: Number(rating),
        comment,
    };

    const gig = await Gig.findById(gigId);
    const gigUser = await User.findById(gig.user._id);

    gig.reviews.push(review);
    gig.numOfReviews = gig.reviews.length;
    gig.numOfRatings += 1;
    gigUser.numOfRatings += 1;
    gigUser.numOfReviews += 1;

    const newRatingsGig = (gig.ratings * (gig.numOfRatings - 1) + review.rating)/gig.numOfRatings;

    const newRatingsUser = (gigUser.ratings * (gigUser.numOfRatings - 1) + review.rating)/gigUser.numOfRatings;

    gig.ratings = newRatingsGig;
    gigUser.ratings = newRatingsUser;

    await gig.save({validateBeforeSave: false})
    await gigUser.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        message: "Sucessfully added the review",
        review
    })
})

export const getAllReviews = catchAsyncErrors(async (req, res, next) => {
    const gigId = req.query.id;

    const gig = await Gig.findById(gigId);
    if(!gig){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
        success: true,
        reviews: gig.reviews,
    });
})

export const getUserGigs = catchAsyncErrors(async (req, res , next) => {
    const userGigs = await Gig.find({user: req.params.id}).populate("user", "name avatar");

    if (!userGigs) {
        return next(new ErrorHandler("User gigs not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "User gigs found sucessfully",
        userGigs
    })
})

