import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import userRoutes from "./routes/user-routes.js"
import productRoutes from "./routes/product-routes.js"
import { errorHandler } from "./middleware/error-middleware.js"

// Load environment variables
dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)

// Error handling middleware
app.use(errorHandler)

export default app

