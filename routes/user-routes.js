import express from "express"
import { register, login, getCurrentUser, updateUser } from "../controllers/user-controller.js"
import { protect } from "../middleware/auth-middleware.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.use(protect)
router.get("/me", getCurrentUser)
router.patch("/update-me", updateUser)

export default router

