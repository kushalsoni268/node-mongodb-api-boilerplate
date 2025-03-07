import express from "express"
import {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product-controller.js"
import { protect, restrictTo } from "../middleware/auth-middleware.js"

const router = express.Router()

// Public routes
router.get("/", getAllProducts)
router.get("/:id", getProduct)

// Protected routes
router.use(protect)
router.post("/", createProduct)
router.patch("/:id", updateProduct)
router.delete("/:id", deleteProduct)

// Admin only routes
router.use(restrictTo("admin"))
// Add admin-specific routes here if needed

export default router

