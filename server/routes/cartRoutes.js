import express from "express";
import protect from "../middleware/auth.js";
import { addToCart, getMyCart } from "../controllers/cartController.js";

const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getMyCart);

export default router;
