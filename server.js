import app from "./app.js"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

