import Order from "../models/orderModel.js";
import Gig from "../models/gigModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import { stripe } from "../utils/stripe.js";
import { randomString } from "../utils/utilities.js";

// Create new order
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const { gigId, packageNumber } = req.body;
  // if(!gigId){
  //   return next(new ErrorHandler("Please select a gig", 400));
  // }
  if (!packageNumber || packageNumber < 0 || packageNumber > 2) {
    return next(new ErrorHandler("Please select a package", 400));
  }

  console.log(gigId, packageNumber);
  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(new ErrorHandler("Gig not found with this Id", 404));
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
    imgPublicId: gig.images[0].imgPublicId,
    imgUrl: gig.images[0].imgUrl,
  };

  // res.send(requirements);

  const order = await Order.create({
    orderId: rString,
    amount: totalAmount,
    duration,
    deliveryDate,
    gig: gigId,
    seller: gig.user._id,
    buyer: req.user._id,
    requirements,
    packageDetails,
    image,
    gigTitle: gig.title,
  });

  res.status(201).json({
    success: true,
    message: "Sucessfully created your order",
    order,
  });
});

// Update Order
export const updateOrder = catchAsyncErrors(async (req, res, next) => {});

// update order requirements
export const updateOrderRequirements = catchAsyncErrors(
  async (req, res, next) => {
    const { requirements: answers } = req.body;
    let order = await Order.findById(req.params.id);

    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.requirementsSubmitted){
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
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
      message: "Sucessfully update your order requirements",
      order,
    });
  }
);

// Get single order
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "seller buyer",
    "name email"
  );

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
  // console.log("hello");
  const orders = await Order.find({ user: req.user._id })
    .populate("gig", "title images")
    .populate("seller buyer", "name avatar");
  console.log(orders);

  res.status(200).json({
    success: true,
    message: "Sucessfully found your orders",
    orders,
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
  const { id, packageNumber, gigId } = req.body;
  // console.log(req.body);

  const gig = await Gig.findById(gigId);

  if (!gig) {
    return next(new ErrorHandler("Gig not found with this Id", 404));
  }

  const price = gig.pricing[packageNumber].packagePrice;

  const serviceFee = Number(price) * (0.21).toFixed(2);

  const totalAmount = Number(price + serviceFee).toFixed(2);

  // console.log(totalAmount);
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "inr",
      description: gig.title,
      payment_method: id,
      receipt_email: req.user.email,
      confirm: true,
    });

    console.log(paymentIntent);

    res.status(201).json({
      message: "Payment Intent created Sucessfully",
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntent,
    });
  } catch (error) {
    res.status(400).json({
      message: "Payment Intent not created",
      success: false,
      error: { message: error.message },
    });
  }
});

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
