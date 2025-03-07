import User from "../models/user-model.js"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/app-error.js"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new AppError("Email already in use", 400))
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generate token
    const token = generateToken(user._id)

    // Remove password from output
    user.password = undefined

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400))
    }

    // Check if user exists and password is correct
    const user = await User.findOne({ email }).select("+password")

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect email or password", 401))
    }

    // Generate token
    const token = generateToken(user._id)

    // Remove password from output
    user.password = undefined

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get current user
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Update user details
export const updateUser = async (req, res, next) => {
  try {
    // Filter out fields that shouldn't be updated
    const filteredBody = {}
    const allowedFields = ["name", "email"]

    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        filteredBody[key] = req.body[key]
      }
    })

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    })
  } catch (error) {
    next(error)
  }
}

