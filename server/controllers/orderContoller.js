import Order from "../models/orderModel.js";
import Gig from "../models/gigModel.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { stripe } from "../utils/stripe.js";
import { randomString } from "../utils/utilities.js";
import sendEmail, { sendSendGridEmail } from "../utils/sendEmail.js";
import { razorpayInstance } from "../utils/razorpay.js";
import {
  validatePaymentVerification,
  validateWebhookSignature,
} from "../node_modules/razorpay/dist/utils/razorpay-utils.js";
import { frontendHomeUrl } from "../index.js";
import error from "../middleware/error.js";

// Create new order
export const newOrder = async (user, body) => {
  const {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    gigId,
    packageNumber,
  } = body;

  if (!packageNumber || packageNumber < 0 || packageNumber > 2) {
    throw new Error("Please select a package");
  }

  const gig = await Gig.findById(gigId).populate("user");

  if (!gig) {
    throw new Error("Gig not found with this Id");
  }

  let rString = randomString(13, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ");

  const price = gig.pricing[packageNumber].packagePrice;
  const totalAmount = Number(price).toFixed(2);

  let duration = gig.pricing[packageNumber].packageDeliveryTime
    .toString()
    .split(" ");
  duration = Number(duration[0]);

  let deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + duration);

  const options = gig.requirements.map((requirement) => {
    if (requirement.questionType == "Free Text") {
      return;
    }
    return requirement.options.map((option) => {
      return {
        title: option,
      };
    });
  });

  const requirements = gig.requirements.map((requirement, index) => {
    return {
      questionTitle: requirement.questionTitle,
      questionType: requirement.questionType,
      answerRequired: requirement.answerRequired,
      multipleOptionSelect: requirement.multipleOptionSelect,
      options: options[index],
    };
  });

  const packageDetails = {
    packageTitle: gig.pricing[packageNumber].packageTitle,
    packageDescription: gig.pricing[packageNumber].packageDescription,
    packageDeliveryTime: gig.pricing[packageNumber].packageDeliveryTime,
    revisions: gig.pricing[packageNumber].revisions,
    sourceFile: gig.pricing[packageNumber].sourceFile,
    commercialUse: gig.pricing[packageNumber].commercialUse,
    packagePrice: gig.pricing[packageNumber].packagePrice,
  };

  const image = {
    publicId: gig.images[0].publicId,
    url: gig.images[0].url,
    blurhash: gig.images[0].blurhash,
  };

  const paymentDetails = {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
  };

  // res.send(requirements);

  const order = await Order.create({
    orderId: rString,
    amount: totalAmount,
    duration,
    deliveryDate,
    gig: gigId,
    seller: gig.user._id,
    buyer: user._id,
    requirements,
    packageDetails,
    paymentDetails,
    image,
    gigTitle: gig.title,
    deliveryDate: Date.now() + duration * 24 * 60 * 60 * 1000,
  });

  return order;
};

// Update Order
export const updateOrder = catchAsyncErrors(async (req, res, next) => {});

// update order requirements
export const updateOrderRequirements = catchAsyncErrors(
  async (req, res, next) => {
    const { requirements: answers } = req.body;
    let order = await Order.findById(req.params.id).populate("seller buyer", "name email");

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if (order.requirementsSubmitted) {
      return next(new ErrorHandler("Requirements already submitted", 400));
    }

    const requirements = order.requirements.map((requirement, index) => {
      const temp = {
        questionTitle: requirement.questionTitle,
        questionType: requirement.questionType,
        answerRequired: requirement.answerRequired,
        multipleOptionSelect: requirement.multipleOptionSelect,
      };

      if (requirement.questionType == "Free Text") {
        temp.answerText = answers[index].answer;
        temp.files = answers[index].files;
      } else {
        temp.options = answers[index].answer.map((option, idx) => {
          return {
            title: requirement.options[idx].title,
            selected: option,
          };
        });
      }
      return temp;
    });

    order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        requirements,
        requirementsSubmitted: true,
        requirementsSubmittedAt: Date.now(),
        status: "In Progress",
        deliveryDate: Date.now() + order.duration * 24 * 60 * 60 * 1000,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    ).populate("seller buyer", "name email");

    // send email to seller
    try {
      await sendSendGridEmail({
        to: order.seller.email,
        subject: "New Order",
        templateId: "newOrder",
        data: {
          sellerName: order.seller.name,
          buyerName: order.buyer.name,
          gigTitle: order.gigTitle,
          orderId: order.orderId,
          orderAmount: order.amount,
          link: `${frontendHomeUrl}/orders/${order._id}`,
          deliveryDate: order.deliveryDate.toDateString(),
        },
        text: `You have a new order with order id ${order.orderId}`,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }

    res.status(200).json({
      success: true,
      message: "Sucessfully update your order requirements",
      order,
    });
  }
);

// add order delivery
export const addOrderDelivery = catchAsyncErrors(async (req, res, next) => {
  const { message, files } = req.body;

  if (!message && !files?.length) {
    return next(new ErrorHandler("Please add a message or a file", 400));
  }

  let order = await Order.findById(req.params.id).populate(
    "seller buyer",
    "name email"
  );

  const buyerEmail = order.buyer.email;

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.seller._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add delivery to this order",
        401
      )
    );
  }

  // if (order.deliveryDate < Date.now()) {
  //   return next(new ErrorHandler("Delivery date has passed", 400));
  // }

  if (order.status !== "In Progress" && order.status !== "In Revision") {
    return next(
      new ErrorHandler(
        "You can only deliver an order which is in progress or in revision",
        400
      )
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { $push: { deliveries: { message, files } }, status: "Delivered" },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).populate("seller buyer", "name email avatar");

  // send email to buyer about the delivery
  await sendSendGridEmail({
    to: order.buyer.email,
    subject: "Order Delivered",
    templateId: "orderDelivered",
    data: {
      buyerName: order.buyer.name,
      sellerName: order.seller.name,
      orderId: order.orderId,
      link: `${frontendHomeUrl}/orders/${order._id}`,
    },
    text: `${order.seller.name} has delivered your order with order id ${order.orderId}`,
  });


  res.status(200).json({
    success: true,
    message: "Sucessfully added your order delivery",
    order,
  });
});

// add order revision
export const addOrderRevision = catchAsyncErrors(async (req, res, next) => {
  const { message, files } = req.body;

  if (!message && !files?.length) {
    return next(new ErrorHandler("Please add a message or a file", 400));
  }

  let order = await Order.findById(req.params.id).populate(
    "seller buyer",
    "name email"
  );

  const sellerEmail = order.seller.email;

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.buyer._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add revision to this order",
        401
      )
    );
  }

  if (order.deliveryDate < Date.now()) {
    return next(
      new ErrorHandler("Order already passed its expected delivery date", 400)
    );
  }

  if (order.status !== "Delivered") {
    return next(
      new ErrorHandler(
        "You can only request a revision if your order is delivered",
        400
      )
    );
  }

  if (order.revisions.length > order.packageDetails.revisions) {
    return next(
      new ErrorHandler(
        "You have already requested the maximum number of revisions",
        400
      )
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { $push: { revisions: { message, files } }, status: "In Revision" },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).populate("seller buyer", "name email avatar");

  // send email to seller about the revision
  await sendSendGridEmail({
    to: order.seller.email,
    subject: "Revision Requested",
    templateId: "revisionRequested",
    data: {
      sellerName: order.seller.name,
      buyerName: order.buyer.name,
      orderId: order.orderId,
      link: `${frontendHomeUrl}/orders/${order._id}`,
    },
    text: `${order.buyer.name} has requested a revision for order with order id ${order.orderId}`,
  });

  res.status(200).json({
    success: true,
    message: "Sucessfully added your order revision",
    order,
  });
});

// order completed
export const markOrderAsCompleted = catchAsyncErrors(async (req, res, next) => {
  let order = await Order.findById(req.params.id).populate(
    "seller buyer",
    "name email avatar"
  );

  const buyerEmail = order.buyer.email;
  const sellerEmail = order.seller.email;

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.buyer._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("You are not authorized to complete this order", 401)
    );
  }

  if (order.status !== "Delivered") {
    return next(
      new ErrorHandler("You can only complete an order which is delivered", 400)
    );
  }

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: "Completed", completedAt: Date.now() },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).populate("seller buyer", "name email avatar");

  // adding balance to seller's account
  const seller = await User.findById(order.seller._id);
  seller.balance += order.amount;
  if (seller.balance > 2000) seller.withdrawEligibility = true;
  seller.lastDelivery = Date.now();
  await seller.save({ validateBeforeSave: false });

  // send email to seller
  await sendSendGridEmail({
    to: order.seller.email,
    subject: "Order Completed",
    templateId: "orderCompleted",
    data: {
      sellerName: order.seller.name,
      buyerName: order.buyer.name,
      orderId: order.orderId,
      link: `${frontendHomeUrl}/orders/${order._id}`,
    },
    text: `${order.buyer.name} has marked your order with order id ${order.orderId} as completed`,
  });

  res.status(200).json({
    success: true,
    message: "Sucessfully completed your order",
    order,
  });
});

// Get order detail
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  let order = await Order.findById(req.params.id)
    .populate("seller buyer", "name email avatar")
    .select(
      "+buyerFeedback.comment +buyerFeedback.communication +buyerFeedback.recommend +buyerFeedback.service +sellerFeedback.comment +sellerFeedback.rating"
    );

  const { buyer, seller } = order;

  if(req.user._id.toString() !== buyer._id.toString() && req.user._id.toString() !== seller._id.toString()) {
    return next(new ErrorHandler("You are not authorized to view this order", 401));
  }

  if (order.status !== "Completed") {
    order = {
      ...order._doc,
      buyerFeedback: undefined,
      sellerFeedback: undefined,
      askSellerFeedback: false,
    };
  }

  if (
    order.status === "Completed" &&
    seller._id.toString() === req.user._id.toString()
  ) {
    if (order.buyerFeedback.createdAt && !order.sellerFeedback.createdAt) {
      order = {
        ...order._doc,
        buyerFeedback: undefined,
        sellerFeedback: undefined,
        askSellerFeedback: true,
      };
    }
  }

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    message: "Sucessfully found your order",
    order,
  });
});

// Get logged in user orders
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;
  const userId = req.user._id;
  const orders = await Order.find({
    $or: [
      { buyer: userId },
      { 
        seller: userId, 
        status: { $ne: "Pending" } 
      }
    ],
    status: status ? status : { $ne: "Deleted" }
  })
    // .or({ buyer: req.user._id })
    .populate("gig", "title images")
    .populate("seller buyer", "name avatar")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    message: "Sucessfully found your orders",
    orders,
  });
});

// add buyer feedback
export const addBuyerFeedback = catchAsyncErrors(async (req, res, next) => {
  const { communication, service, recommend, comment } = req.body;

  const order = await Order.findById(req.params.id).populate(
    "seller buyer",
    "name email"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.buyer._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add feedback to this order",
        401
      )
    );
  }

  if (order.status !== "Completed") {
    return next(
      new ErrorHandler(
        "You can only add feedback to an order which is completed",
        400
      )
    );
  }

  if (order.buyerFeedback.createdAt) {
    return next(
      new ErrorHandler("You have already added feedback to this order", 400)
    );
  }

  const buyerFeedback = {
    communication,
    service,
    recommend,
    comment,
    createdAt: Date.now(),
  };

  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { buyerFeedback },
    { new: true, runValidators: true, useFindAndModify: false }
  ).populate("seller buyer", "name email avatar");

  res.status(200).json({
    success: true,
    message: "Sucessfully added your feedback",
    order: updatedOrder,
  });
});

// add seller feedback
export const addSellerFeedback = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;
  //

  let order = await Order.findById(req.params.id)
    .populate("seller buyer", "name email avatar")
    .select(
      "+buyerFeedback.comment +buyerFeedback.communication +buyerFeedback.recommend +buyerFeedback.service  +sellerFeedback.comment +sellerFeedback.rating"
    );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (order.seller._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "You are not authorized to add feedback as a seller to this order",
        401
      )
    );
  }

  if (order.status !== "Completed") {
    return next(
      new ErrorHandler(
        "You can only add feedback to an order which is completed",
        400
      )
    );
  }

  if (!order.buyerFeedback.createdAt) {
    return next(
      new ErrorHandler(
        "You can only add feedback after the buyer has added feedback",
        400
      )
    );
  }

  if (order.sellerFeedback.createdAt) {
    return next(
      new ErrorHandler("You have already added feedback to this order", 400)
    );
  }

  const sellerFeedback = {
    rating,
    comment,
    createdAt: Date.now(),
  };

  order = await Order.findByIdAndUpdate(
    req.params.id,
    { sellerFeedback },
    { new: true, runValidators: true, useFindAndModify: false }
  )
    .populate("seller buyer", "name email avatar country ")
    .select(
      "+buyerFeedback.comment +buyerFeedback.communication +buyerFeedback.recommend +buyerFeedback.service +sellerFeedback.comment +sellerFeedback.rating"
    );

  order = {
    ...order._doc,
    askSellerFeedback: false,
  };

  const buyer = await User.findById(order.buyer._id);
  const seller = await User.findById(order.seller._id);
  const gig = await Gig.findById(order.gig);

  const reviewForSeller = {
    user: order.buyer._id,
    name: order.buyer.name,
    avatar: order.buyer.avatar,
    country: order.buyer.country,
    rating: Math.round(
      Number(
        (order.buyerFeedback.communication +
          order.buyerFeedback.service +
          order.buyerFeedback.recommend) /
          3
      )
    ),
    comment: order.buyerFeedback.comment,
  };

  const reviewForBuyer = {
    user: order.seller._id,
    name: order.seller.name,
    avatar: order.seller.avatar,
    country: order.seller.country,
    rating: rating,
    comment: comment,
  };

  if (reviewForSeller.comment) gig.reviews.push(reviewForSeller);
  gig.numOfReviews = gig.reviews.length;
  gig.numOfRatings += 1;

  if (reviewForSeller.comment) seller.reviews.push(reviewForSeller);
  seller.numOfRatings += 1;
  seller.numOfReviews = seller.reviews.length;

  if (reviewForBuyer.comment) buyer.reviews.push(reviewForBuyer);
  buyer.numOfRatings += 1;
  buyer.numOfReviews = buyer.reviews.length;

  const newRatingsGig =
    (gig.ratings * (gig.numOfRatings - 1) + reviewForSeller.rating) /
    gig.numOfRatings;

  const newRatingsSeller =
    (seller.ratings * (seller.numOfRatings - 1) + reviewForSeller.rating) /
    seller.numOfRatings;

  const newRatingsBuyer =
    (buyer.ratings * (buyer.numOfRatings - 1) + reviewForBuyer.rating) /
    buyer.numOfRatings;

  gig.ratings = newRatingsGig;
  seller.ratings = newRatingsSeller;
  buyer.ratings = newRatingsBuyer;

  await gig.save({ validateBeforeSave: false });
  await seller.save({ validateBeforeSave: false });
  await buyer.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Sucessfully added your feedback",
    order,
  });
});

// Get all orders -- Admin
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.amount;
  });

  res.status(200).json({
    success: true,
    message: "Sucessfully fetched all orders",
    totalAmount,
    orders,
  });
});

// Update order status -- Admin
export const updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  if (order.status == "Completed") {
    return next(new ErrorHandler("Order already completed", 400));
  }

  order.status = req.body.status;

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "Sucessfully fetched all orders",
    order,
  });
});

// process payment
export const packagePayment = catchAsyncErrors(async (req, res, next) => {
  const { id, packageNumber, gigId, orderId } = req.body;

  const gig = await Gig.findById(gigId);

  if (!gig) {
    await Order.deleteOne({ _id: orderId });
    return next(new ErrorHandler("Gig not found with this Id", 404));
  }

  const price = gig.pricing[packageNumber].packagePrice;

  const serviceFee = Number(price) * (0.21).toFixed(2);

  const totalAmount = Number(price + serviceFee).toFixed(2);

  //
  // try {
  //   const paymentIntent = await stripe.paymentIntents.create({
  //     amount: totalAmount * 100,
  //     currency: "inr",
  //     description: gig.title,
  //     payment_method: id,
  //     receipt_email: req.user.email,
  //     confirm: true,
  //   });

  //   //

  //   res.status(201).json({
  //     message: "Payment Intent created Sucessfully",
  //     success: true,
  //     clientSecret: paymentIntent.client_secret,
  //     paymentIntent,
  //   });
  // } catch (error) {
  //   res.status(400).json({
  //     message: "Payment Intent not created",
  //     success: false,
  //     error: { message: error.message },
  //   });
  // }

  const options = {
    amount: Number(totalAmount) * 100,
    currency: "INR",
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(201).json({
    success: true,
    message: "Payment Intent created Sucessfully",
    order,
  });
});

// payment verification
export const paymentVerification = catchAsyncErrors(async (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const isPaymentAuthentic = validatePaymentVerification(
    { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
    razorpay_signature,
    process.env.RAZORPAY_KEY_SECRET
  );

  if (!isPaymentAuthentic) {
    return next(new ErrorHandler("Payment not verified", 400));
  }

  try {
    const order = await newOrder(req.user, req.body);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

export const checkout = async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
  };

  const order = await razorpayInstance.orders.create(options);

  res.status(201).json({
    success: true,
    message: "Payment Intent created Sucessfully",
    order,
  });
};

export const getStripePublishableKey = catchAsyncErrors(
  async (req, res, next) => {
    res.status(200).json({
      stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  }
);

export const deleteAllOrders = catchAsyncErrors(async (req, res, next) => {
  await Order.deleteMany();

  res.status(200).json({
    success: true,
    message: "Sucessfully deleted all orders",
  });
});
