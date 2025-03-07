import jwt from "jsonwebtoken"
import { promisify } from "util"
import User from "../models/user-model.js"
import { AppError } from "../utils/app-error.js"

export const protect = async (req, res, next) => {
  try {
    // 1) Get token and check if it exists
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next(new AppError("You are not logged in. Please log in to get access.", 401))
    }

    // 2) Verify token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
      return next(new AppError("The user belonging to this token no longer exists.", 401))
    }

    // 4) Grant access to protected route
    req.user = currentUser
    next()
  } catch (error) {
    next(error)
  }
}

// Restrict to certain roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403))
    }
    next()
  }
}

