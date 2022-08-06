import Order from '../models/orderModel.js'
import Gig from "../models/gigModel.js"
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";

// Create new order 
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const { amount, duration, deliveryDate, gigId } = req.body;

    const order = await Order.create({
        amount,
        duration,
        deliveryDate,
        gig: gigId,
        user: req.user._id,
    })

    res.status(201).json({
        success: true,
        message: "Sucessfully created your order",
        order,
    })
})

// Get single order 
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    res.status(200).json({
        success: true,
        message: "Sucessfully found your order",
        order,
    })
})

// Get logged in user orders 
export const myOrders = catchAsyncErrors(async (req, res, next) => {
    // console.log("hello");
    const orders = await Order.find({ user: req.user._id });
    // console.log(orders);
    
    res.status(200).json({
        success: true,
        message: "Sucessfully found your orders",
        orders,
    })
})


// Get all orders -- Admin 
export const getAllOrders = catchAsyncErrors(async(req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order => {
        totalAmount += order.amount;
    })

    res.status(200).json({
        success: true,
        message: "Sucessfully fetched all orders",
        totalAmount,  
        orders,
    })
})
// Update order status -- Admin 
export const updateOrderStatus = catchAsyncErrors(async(req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this Id", 404));
    }

    if(order.status == "Completed"){
        return next(new ErrorHandler("Order already completed", 400));
    }

    order.status = req.body.status;

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
        message: "Sucessfully fetched all orders",
        order,
    })
})
