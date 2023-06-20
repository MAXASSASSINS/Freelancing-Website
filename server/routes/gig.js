import express from "express";
import {
  createGig,
  createGigReview,
  deleteGig,
  getAllGigs,
  getAllReviews,
  getGig,
  getUserGigs,
  updateGig,
} from "../controllers/gigController.js";
import { authorisedRoles, isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/gig/create", isAuthenticated, createGig);

router.get("/gig/gigs", getAllGigs);
router.get("/gig/details/:id", getGig);
router.get("/gig/gigs/user/:id", getUserGigs);

router.put("/gig/update/:id", isAuthenticated, updateGig);
router.delete("/gig/delete/:id", isAuthenticated, deleteGig);

router.put("/review", isAuthenticated, createGigReview);
router.get("/getAllReviews", getAllReviews);

export default router;
