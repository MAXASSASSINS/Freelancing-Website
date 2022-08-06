import express from "express"
import { getAllOrders, getOrderDetails, myOrders, newOrder, updateOrderStatus } from "../controllers/orderContoller.js";
import { authorisedRoles, isAuthenticated } from '../middleware/auth.js';

const router = express.Router();


router.post("/order/new", isAuthenticated, newOrder);
router.get("/order/:id", isAuthenticated, authorisedRoles("admin"), getOrderDetails);
router.get("/orders/me", isAuthenticated, myOrders);

router.get('/orders/getAll',isAuthenticated, authorisedRoles("admin"), getAllOrders);
router.put('/orders/updateOrderStatus/:id', isAuthenticated, authorisedRoles("admin"), updateOrderStatus);

export default router;