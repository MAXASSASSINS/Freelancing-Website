import express from "express";
import {
  getAllOrders,
  getOrderDetails,
  getStripePublishableKey,
  myOrders,
  newOrder,
  packagePayment,
  updateOrderStatus,
  updateOrder,
  deleteAllOrders,
  updateOrderRequirements,
  addOrderDelivery,
  addOrderRevision,
  markOrderAsCompleted,
  addBuyerFeedback,
  addSellerFeedback,
} from "../controllers/orderContoller.js";
import { authorisedRoles, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/order/new", isAuthenticated, newOrder);
router.get("/order/details/:id", isAuthenticated, getOrderDetails);
router.get("/orders/me", isAuthenticated, myOrders);

router.get(
  "/orders/getAll",
  isAuthenticated,
  authorisedRoles("admin"),
  getAllOrders
);
router.put(
  "/orders/updateOrderStatus/:id",
  isAuthenticated,
  authorisedRoles("admin"),
  updateOrderStatus
);

router.put("/order/update/:id", isAuthenticated, updateOrder);
router.put(
  "/order/update/requirements/:id",
  isAuthenticated,
  updateOrderRequirements
);
router.post("/order/add/delivery/:id", isAuthenticated, addOrderDelivery);
router.post("/order/add/revision/:id", isAuthenticated, addOrderRevision);
router.post("/order/completed/:id", isAuthenticated, markOrderAsCompleted);
router.post("/order/:id/buyer/feedback", isAuthenticated, addBuyerFeedback);
router.post("/order/:id/seller/feedback", isAuthenticated, addSellerFeedback);

router.delete("/orders/delete", deleteAllOrders);

router.post("/package/payment", isAuthenticated, packagePayment);

router.get(
  "/get/stripe/publishable/key",
  isAuthenticated,
  getStripePublishableKey
);

export default router;
